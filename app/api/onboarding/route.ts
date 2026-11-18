import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "../../../db";
import { branches, instituteModules, institutes, users } from "../../../db/schema";

export async function POST(request: Request) {
  const form = await request.formData();
  const instituteName = String(form.get("instituteName") ?? "").trim();
  const subdomain = String(form.get("subdomain") ?? "").trim().toLowerCase();
  const ownerName = String(form.get("ownerName") ?? "").trim();
  const ownerEmail = String(form.get("ownerEmail") ?? "").trim().toLowerCase();
  const selectedModules = form.getAll("modules").map(String);

  if (!instituteName || !subdomain || !ownerName || !ownerEmail) return NextResponse.json({ error: "Complete all required fields." }, { status: 400 });
  if (!/^[a-z0-9-]+$/.test(subdomain)) return NextResponse.json({ error: "Use lowercase letters, numbers, and hyphens only for the subdomain." }, { status: 400 });
  if (["www", "app", "api", "admin", "mail"].includes(subdomain)) return NextResponse.json({ error: "That subdomain is reserved." }, { status: 400 });

  const existing = await db.select({ id: institutes.id }).from(institutes).where(eq(institutes.subdomain, subdomain)).limit(1);
  if (existing.length) return NextResponse.json({ error: "That subdomain is already taken." }, { status: 409 });

  const [institute] = await db.insert(institutes).values({ name: instituteName, slug: subdomain, subdomain, tagline: "Connected Learning, Infinite Growth" }).returning();
  await db.insert(branches).values({ instituteId: institute.id, name: "Main Branch", code: "MAIN" });
  await db.insert(users).values({ instituteId: institute.id, email: ownerEmail, name: ownerName, role: "owner" });
  if (selectedModules.length) await db.insert(instituteModules).values(selectedModules.map((module) => ({ instituteId: institute.id, module: module as typeof instituteModules.$inferInsert.module })));

  return NextResponse.json({ ok: true, url: `https://${subdomain}.madlyloaded.com` }, { status: 201 });
}
