import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "../../../../../db";
import { emailVerifications } from "../../../../../db/schema";
import { hashEmailOtp, OTP_MAX_ATTEMPTS } from "../../../../../lib/email-otp";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { email: rawEmail, otp: rawOtp } = await request.json().catch(() => ({}));
    const email = String(rawEmail ?? "").trim().toLowerCase();
    const otp = String(rawOtp ?? "").trim();
    const [verification] = await db.select().from(emailVerifications).where(eq(emailVerifications.email, email)).orderBy(emailVerifications.createdAt).limit(1);
    if (!verification || verification.verifiedAt || verification.expiresAt.getTime() < Date.now()) return NextResponse.json({ error: "That code is invalid or expired." }, { status: 400 });
    if (verification.attempts >= OTP_MAX_ATTEMPTS) return NextResponse.json({ error: "Too many attempts. Request a new code." }, { status: 429 });
    if (!/^\d{6}$/.test(otp) || hashEmailOtp(otp) !== verification.otpHash) {
      await db.update(emailVerifications).set({ attempts: verification.attempts + 1 }).where(eq(emailVerifications.id, verification.id));
      return NextResponse.json({ error: "Incorrect OTP. Please check the code and try again." }, { status: 400 });
    }
    await db.update(emailVerifications).set({ verifiedAt: new Date() }).where(eq(emailVerifications.id, verification.id));
    return NextResponse.json({ ok: true, verified: true });
  } catch (error) {
    console.error("Email OTP verification failed:", error);
    return NextResponse.json({ error: "We could not verify the code right now. Please try again." }, { status: 500 });
  }
}
