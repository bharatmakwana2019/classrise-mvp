import { config } from "dotenv";
config({ path: ".env.local" });
import { eq } from "drizzle-orm";
import { db } from "../db";
import { branches, instituteModules, institutes, students, users } from "../db/schema";

const ownerEmail = process.env.ADHYAYAN_OWNER_EMAIL ?? "owner@adhayantutorials.example";

const existing = await db.select().from(institutes).where(eq(institutes.subdomain, "adhyayan-tutorials")).limit(1).then((rows) => rows[0]);

if (existing) {
  console.log("Adhyayan Tutorials already exists:", existing.id);
  process.exit(0);
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
