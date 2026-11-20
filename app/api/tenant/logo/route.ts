import { and, eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { db } from "../../../../db";
import { institutes, users } from "../../../../db/schema";
import { authOptions } from "../../../../lib/auth";
import { tenantFromHost } from "../../../../lib/tenant-host";

export const runtime = "nodejs";
const maxLogoBytes = 512 * 1024;
const maxDimension = 4096;
const maxPixels = 12_000_000;
const jpegStartOfFrame = new Set([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf]);

function dimensions(bytes: Buffer, mime: "image/png" | "image/jpeg") {
  if (mime === "image/png") {
    if (bytes.length < 24 || bytes.toString("ascii", 12, 16) !== "IHDR") return null;
    return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
  }

  let offset = 2;
  while (offset + 8 < bytes.length) {
    if (bytes[offset] !== 0xff) { offset += 1; continue; }
    while (bytes[offset] === 0xff) offset += 1;
    const marker = bytes[offset++];
    if (marker === 0xd8 || marker === 0xd9 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) continue;
    if (offset + 2 > bytes.length) return null;
    const segmentLength = bytes.readUInt16BE(offset);
    if (segmentLength < 2 || offset + segmentLength > bytes.length) return null;
    if (jpegStartOfFrame.has(marker)) {
      if (segmentLength < 7) return null;
      return { height: bytes.readUInt16BE(offset + 3), width: bytes.readUInt16BE(offset + 5) };
    }
    offset += segmentLength;
  }
  return null;
}

function imageMime(bytes: Buffer): "image/png" | "image/jpeg" | null {
  if (bytes.length >= 24 && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) && bytes.toString("ascii", 12, 16) === "IHDR") return "image/png";
  if (bytes.length >= 4 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  return null;
}

async function authorizedInstitute(request: Request) {
  const session = await getServerSession(authOptions);
  const requestHeaders = await headers();
  const host = requestHeaders.get("host");
  const subdomain = tenantFromHost(host);
  const origin = request.headers.get("origin");
  if (origin) {
    try {
      if (!host || new URL(origin).host !== host) return { error: "Request origin could not be verified.", status: 403 as const };
    } catch {
      return { error: "Request origin could not be verified.", status: 403 as const };
    }
  }
  if (!session?.user?.id || !session.user.instituteId || session.user.role !== "owner" || !subdomain || session.user.tenantSubdomain !== subdomain) {
    return { error: "Only an institute owner can change its logo.", status: 403 as const };
  }
  const [owner] = await db.select({ id: users.id }).from(users)
    .innerJoin(institutes, eq(users.instituteId, institutes.id))
    .where(and(
      eq(users.id, session.user.id),
      eq(users.instituteId, session.user.instituteId),
      eq(users.role, "owner"),
      eq(users.isActive, true),
      eq(institutes.subdomain, subdomain),
      eq(institutes.isActive, true),
    )).limit(1);
  if (!owner) return { error: "Only an active institute owner can change its logo.", status: 403 as const };
  return { instituteId: session.user.instituteId };
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > maxLogoBytes + 32 * 1024) return NextResponse.json({ error: "Choose an image smaller than 512 KB." }, { status: 413 });
  const authorization = await authorizedInstitute(request);
  if ("error" in authorization) return NextResponse.json({ error: authorization.error }, { status: authorization.status });

  const form = await request.formData().catch(() => null);
  const file = form?.get("logo");
  if (!(file instanceof File)) return NextResponse.json({ error: "Choose a PNG or JPEG logo to upload." }, { status: 400 });
  if (file.size === 0 || file.size > maxLogoBytes) return NextResponse.json({ error: "Choose an image smaller than 512 KB." }, { status: 413 });

  const bytes = Buffer.from(await file.arrayBuffer());
  const mime = imageMime(bytes);
  if (!mime || (file.type && file.type !== mime)) return NextResponse.json({ error: "Upload a valid PNG or JPEG image." }, { status: 415 });
  const size = dimensions(bytes, mime);
  if (!size || size.width < 1 || size.height < 1 || size.width > maxDimension || size.height > maxDimension || size.width * size.height > maxPixels) {
    return NextResponse.json({ error: "Logo dimensions must be at most 4096 × 4096 pixels." }, { status: 400 });
  }

  const logoUrl = `data:${mime};base64,${bytes.toString("base64")}`;
  const [updated] = await db.update(institutes).set({ logoUrl }).where(eq(institutes.id, authorization.instituteId)).returning({ id: institutes.id });
  if (!updated) return NextResponse.json({ error: "Institute not found." }, { status: 404 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const authorization = await authorizedInstitute(request);
  if ("error" in authorization) return NextResponse.json({ error: authorization.error }, { status: authorization.status });
  await db.update(institutes).set({ logoUrl: null }).where(and(eq(institutes.id, authorization.instituteId), eq(institutes.isActive, true)));
  return NextResponse.json({ ok: true });
}
