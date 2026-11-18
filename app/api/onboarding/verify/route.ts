import { createHmac, timingSafeEqual } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "../../../../db";
import { branches, instituteModules, institutes, onboardingPayments, users } from "../../../../db/schema";

export const runtime = "nodejs";

const tenantBaseDomain = process.env.TENANT_BASE_DOMAIN || "madlyloaded.com";

function validSignature(orderId: string, paymentId: string, signature: string, secret: string) {
  const expected = createHmac("sha256", secret).update(`${orderId}|${paymentId}`).digest();
  const received = Buffer.from(signature, "hex");
  return received.length === expected.length && timingSafeEqual(expected, received);
}

export async function POST(request: Request) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return NextResponse.json({ error: "Payments are not configured." }, { status: 503 });

  const body = await request.json().catch(() => null) as null | { draftId?: string; razorpay_order_id?: string; razorpay_payment_id?: string; razorpay_signature?: string };
  const { draftId, razorpay_order_id: orderId, razorpay_payment_id: paymentId, razorpay_signature: signature } = body ?? {};
  if (!draftId || !orderId || !paymentId || !signature) return NextResponse.json({ error: "Payment details are incomplete." }, { status: 400 });

  const [draft] = await db.select().from(onboardingPayments).where(and(eq(onboardingPayments.id, draftId), eq(onboardingPayments.orderId, orderId))).limit(1);
  if (!draft) return NextResponse.json({ error: "This checkout could not be matched to an onboarding request." }, { status: 404 });
  if (!draft.passwordHash) return NextResponse.json({ error: "Owner credential setup is incomplete. Contact support to finish onboarding." }, { status: 409 });
  if (!validSignature(orderId, paymentId, signature, keySecret)) return NextResponse.json({ error: "Payment verification failed." }, { status: 400 });
  if (draft.status === "completed" && draft.instituteId && draft.paymentId === paymentId) return NextResponse.json({ ok: true, url: `https://${draft.subdomain}.${tenantBaseDomain}` });

  const auth = `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`;
  let paymentResponse = await fetch(`https://api.razorpay.com/v1/payments/${encodeURIComponent(paymentId)}`, { headers: { Authorization: auth }, cache: "no-store" });
  if (!paymentResponse.ok) return NextResponse.json({ error: "We could not confirm the payment with Razorpay yet." }, { status: 502 });
  let payment = await paymentResponse.json();
  if (payment.order_id === orderId && payment.amount === draft.amount && payment.currency === draft.currency && payment.status === "authorized") {
    const captureResponse = await fetch(`https://api.razorpay.com/v1/payments/${encodeURIComponent(paymentId)}/capture`, {
      method: "POST", headers: { Authorization: auth, "Content-Type": "application/json" },
      body: JSON.stringify({ amount: draft.amount, currency: draft.currency }),
    });
    if (!captureResponse.ok) return NextResponse.json({ error: "Payment was authorized but could not be captured yet. Please retry verification or contact support." }, { status: 502 });
    payment = await captureResponse.json();
  }
  if (payment.order_id !== orderId || payment.amount !== draft.amount || payment.currency !== draft.currency || payment.status !== "captured") {
    return NextResponse.json({ error: "Payment is not captured for this onboarding order yet." }, { status: 409 });
  }

  let instituteId = draft.instituteId;
  if (!instituteId) {
    const [existing] = await db.select({ id: institutes.id }).from(institutes).where(eq(institutes.subdomain, draft.subdomain)).limit(1);
    if (existing) return NextResponse.json({ error: "That subdomain is already taken. Contact support to finish onboarding." }, { status: 409 });
    const [institute] = await db.insert(institutes).values({ name: draft.instituteName, slug: draft.subdomain, subdomain: draft.subdomain, tagline: "Connected Learning, Infinite Growth" }).returning({ id: institutes.id });
    instituteId = institute.id;
    await db.update(onboardingPayments).set({ instituteId, paymentId, status: "provisioning" }).where(eq(onboardingPayments.id, draft.id));
  }

  const [branch] = await db.select({ id: branches.id }).from(branches).where(eq(branches.instituteId, instituteId)).limit(1);
  if (!branch) await db.insert(branches).values({ instituteId, name: "Main Branch", code: "MAIN" });
  const [owner] = await db.select({ id: users.id }).from(users).where(and(eq(users.instituteId, instituteId), eq(users.email, draft.ownerEmail))).limit(1);
  if (!owner) await db.insert(users).values({ instituteId, email: draft.ownerEmail, name: draft.ownerName, passwordHash: draft.passwordHash, role: "owner" });
  for (const module of draft.modules) {
    const [enabled] = await db.select({ id: instituteModules.id }).from(instituteModules).where(and(eq(instituteModules.instituteId, instituteId), eq(instituteModules.module, module as typeof instituteModules.$inferInsert.module))).limit(1);
    if (!enabled) await db.insert(instituteModules).values({ instituteId, module: module as typeof instituteModules.$inferInsert.module });
  }
  await db.update(onboardingPayments).set({ instituteId, paymentId, status: "completed" }).where(eq(onboardingPayments.id, draft.id));
  return NextResponse.json({ ok: true, url: `https://${draft.subdomain}.${tenantBaseDomain}` });
}
