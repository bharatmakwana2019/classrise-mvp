import { config } from "dotenv";
config({ path: ".env.local" });
import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { branches, instituteModules, institutes, students, users } from "../db/schema";
import { hashPassword } from "../lib/password";

const ownerEmail = process.env.ADHYAYAN_OWNER_EMAIL ?? "owner@adhayantutorials.example";
const ownerPassword = process.env.ADHYAYAN_OWNER_PASSWORD;

const existing = await db.select().from(institutes).where(eq(institutes.subdomain, "adhyayan-tutorials")).limit(1).then((rows) => rows[0]);

if (existing) {
  if (ownerPassword) {
    if (ownerPassword.length < 12 || ownerPassword.length > 128) throw new Error("ADHYAYAN_OWNER_PASSWORD must be between 12 and 128 characters.");
    const [existingOwner] = await db.select({ id: users.id }).from(users)
      .where(and(eq(users.instituteId, existing.id), eq(users.email, ownerEmail), eq(users.role, "owner"))).limit(1);
    const passwordHash = await hashPassword(ownerPassword);
    if (existingOwner) await db.update(users).set({ passwordHash }).where(eq(users.id, existingOwner.id));
    else await db.insert(users).values({ instituteId: existing.id, email: ownerEmail, name: "Adhyayan Tutorials Owner", passwordHash, role: "owner" });
    console.log("Updated the Adhyayan owner password hash.");
    process.exit(0);
  }
  console.log("Adhyayan Tutorials already exists:", existing.id);
  process.exit(0);
}

if (!ownerPassword || ownerPassword.length < 12 || ownerPassword.length > 128) {
  throw new Error("Set ADHYAYAN_OWNER_PASSWORD to a 12–128 character password before creating the seed institute.");
}

const [institute] = await db.insert(institutes).values({
  name: "Adhyayan Tutorials",
  slug: "adhyayan-tutorials",
  subdomain: "adhyayan-tutorials",
  tagline: "Connected Learning, Infinite Growth",
}).returning();

const [branch] = await db.insert(branches).values({
  instituteId: institute.id,
  name: "Main Branch",
  code: "AT-MAIN",
}).returning();

await db.insert(users).values({
  instituteId: institute.id,
  email: ownerEmail,
  name: "Adhyayan Tutorials Owner",
  passwordHash: await hashPassword(ownerPassword),
  role: "owner",
});

await db.insert(instituteModules).values([
  "students", "attendance", "fees", "timetable", "tests_results", "content", "reports", "communications",
].map((module) => ({ instituteId: institute.id, module: module as typeof instituteModules.$inferInsert.module })));

const studentRows = Array.from({ length: 120 }, (_, index) => ({
  instituteId: institute.id,
  branchId: branch.id,
  admissionNumber: `AT-${String(index + 1).padStart(3, "0")}`,
  name: `Adhyayan Student ${index + 1}`,
  standard: 8 + (index % 3),
}));

await db.insert(students).values(studentRows);
console.log(`Seeded ${institute.name} with ${studentRows.length} students.`);
