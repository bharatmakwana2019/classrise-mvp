import { createHmac, timingSafeEqual } from "node:crypto";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "../../../../db";
import { razorpayWebhookEvents } from "../../../../db/schema";

export const runtime = "nodejs";

function isValidSignature(body: string, received: string, secret: string) {
  const expected = createHmac("sha256", secret).update(body).digest("hex");
  const expectedBuffer = Buffer.from(expected, "utf8");
  const receivedBuffer = Buffer.from(received, "utf8");
  return expectedBuffer.length === receivedBuffer.length && timingSafeEqual(expectedBuffer, receivedBuffer);
}

export async function POST(request: Request) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = request.headers.get("x-razorpay-signature");
  const eventId = request.headers.get("x-razorpay-event-id");
  const rawBody = await request.text();

  if (!secret || !signature || !eventId || !isValidSignature(rawBody, signature, secret)) {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 });
  }

  const payload = JSON.parse(rawBody) as { event?: string };
  const existing = await db.select({ id: razorpayWebhookEvents.id }).from(razorpayWebhookEvents).where(eq(razorpayWebhookEvents.eventId, eventId)).limit(1);
  if (existing.length) return NextResponse.json({ ok: true, duplicate: true });

  await db.insert(razorpayWebhookEvents).values({ eventId, event: payload.event ?? "unknown", payload });
  return NextResponse.json({ ok: true });
}
