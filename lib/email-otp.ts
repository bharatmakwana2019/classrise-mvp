import { createHash, randomInt } from "node:crypto";

export const OTP_TTL_MS = 10 * 60 * 1000;
export const OTP_RESEND_MS = 60 * 1000;
export const OTP_MAX_ATTEMPTS = 5;

export function createEmailOtp() {
  const otp = String(randomInt(100000, 1000000));
  return { otp, hash: createHash("sha256").update(otp).digest("hex") };
}

export function hashEmailOtp(otp: string) {
  return createHash("sha256").update(otp).digest("hex");
}
