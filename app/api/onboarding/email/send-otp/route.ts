import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "../../../../../db";
import { emailVerifications } from "../../../../../db/schema";
import { createEmailOtp, OTP_RESEND_MS, OTP_TTL_MS } from "../../../../../lib/email-otp";
import { sendEmailOtp } from "../../../../../lib/gmail";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const { email: rawEmail } = await request.json().catch(() => ({}));
  const email = String(rawEmail ?? "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  const [existing] = await db.select().from(emailVerifications).where(eq(emailVerifications.email, email)).orderBy(emailVerifications.createdAt).limit(1);
  if (existing && Date.now() - existing.lastSentAt.getTime() < OTP_RESEND_MS) return NextResponse.json({ error: "Please wait one minute before requesting another code." }, { status: 429 });
  const { otp, hash } = createEmailOtp();
  const values = { email, otpHash: hash, expiresAt: new Date(Date.now() + OTP_TTL_MS), attempts: 0, lastSentAt: new Date(), verifiedAt: null };
  if (existing) await db.update(emailVerifications).set(values).where(eq(emailVerifications.id, existing.id));
  else await db.insert(emailVerifications).values(values);
  try { await sendEmailOtp(email, otp); } catch (error) { console.error("Email OTP delivery failed:", error); return NextResponse.json({ error: "We could not send the verification email." }, { status: 502 }); }
  return NextResponse.json({ ok: true, message: "Verification code sent." });
}
