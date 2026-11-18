import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "../../../db";
import { institutes, onboardingPayments } from "../../../db/schema";
import { hashPassword } from "../../../lib/password";

export const runtime = "nodejs";

const allowedModules = new Set(["students", "attendance", "fees", "timetable", "tests_results", "content", "reports", "communications"]);

export async function POST(request: Request) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  const amount = Number(process.env.RAZORPAY_PLAN_AMOUNT_PAISE);
  if (!keyId || !keySecret || !Number.isSafeInteger(amount) || amount <= 0) {
    return NextResponse.json({ error: "Online onboarding is not configured yet. Please contact support." }, { status: 503 });
  }

  const form = await request.formData();
  const instituteName = String(form.get("instituteName") ?? "").trim();
  const subdomain = String(form.get("subdomain") ?? "").trim().toLowerCase();
  const ownerName = String(form.get("ownerName") ?? "").trim();
  const ownerEmail = String(form.get("ownerEmail") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");
  const passwordConfirmation = String(form.get("passwordConfirmation") ?? "");
  const modules = [...new Set(form.getAll("modules").map(String).filter((value) => allowedModules.has(value)))];

  if (!instituteName || !subdomain || !ownerName || !ownerEmail || !password) return NextResponse.json({ error: "Complete all required fields." }, { status: 400 });
  if (password.length < 12 || password.length > 128) return NextResponse.json({ error: "Choose a password between 12 and 128 characters." }, { status: 400 });
  if (password !== passwordConfirmation) return NextResponse.json({ error: "The passwords do not match." }, { status: 400 });
  if (!/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(subdomain)) return NextResponse.json({ error: "Use a valid subdomain with lowercase letters, numbers, and internal hyphens." }, { status: 400 });
  if (["www", "app", "api", "admin", "mail"].includes(subdomain)) return NextResponse.json({ error: "That subdomain is reserved." }, { status: 400 });
  const [existingInstitute] = await db.select({ id: institutes.id }).from(institutes).where(eq(institutes.subdomain, subdomain)).limit(1);
  if (existingInstitute) return NextResponse.json({ error: "That subdomain is already taken." }, { status: 409 });

  const passwordHash = await hashPassword(password);
  const [draft] = await db.insert(onboardingPayments).values({ instituteName, subdomain, ownerName, ownerEmail, passwordHash, modules, amount }).returning({ id: onboardingPayments.id });
  try {
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: { Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`, "Content-Type": "application/json" },
      body: JSON.stringify({ amount, currency: "INR", receipt: `onboard_${draft.id}`, notes: { onboarding_id: draft.id } }),
    });
    const order = await response.json();
    if (!response.ok || typeof order.id !== "string") throw new Error("Razorpay could not create the payment order.");
    await db.update(onboardingPayments).set({ orderId: order.id }).where(eq(onboardingPayments.id, draft.id));
    return NextResponse.json({ draftId: draft.id, orderId: order.id, amount, currency: "INR", keyId, name: instituteName, email: ownerEmail }, { status: 201 });
  } catch {
    await db.update(onboardingPayments).set({ status: "order_failed" }).where(eq(onboardingPayments.id, draft.id));
    return NextResponse.json({ error: "We could not start checkout. Please try again." }, { status: 502 });
  }
}
