import { randomBytes, scryptSync } from "node:crypto";
import { config } from "dotenv";

config({ path: ".env.local" });

const { DATABASE_URL, TARGET_SUBDOMAIN, TARGET_EMAIL, TARGET_PASSWORD } = process.env;
if (!DATABASE_URL || !TARGET_SUBDOMAIN || !TARGET_EMAIL || !TARGET_PASSWORD) {
  throw new Error("Set DATABASE_URL, TARGET_SUBDOMAIN, TARGET_EMAIL, and TARGET_PASSWORD before running this command.");
}
if (TARGET_PASSWORD.length < 12 || TARGET_PASSWORD.length > 128) {
  throw new Error("TARGET_PASSWORD must be between 12 and 128 characters.");
}

const { neon } = await import("@neondatabase/serverless");
const sql = neon(DATABASE_URL);
const [user] = await sql`
  SELECT users.id
  FROM users
  INNER JOIN institutes ON users.institute_id = institutes.id
  WHERE institutes.subdomain = ${TARGET_SUBDOMAIN.toLowerCase()}
    AND lower(users.email) = ${TARGET_EMAIL.trim().toLowerCase()}
  LIMIT 1
`;
if (!user) throw new Error("No user matched that email and institute subdomain.");

const salt = randomBytes(16).toString("hex");
const derived = scryptSync(TARGET_PASSWORD, salt, 64).toString("hex");
await sql`UPDATE users SET password_hash = ${`scrypt$${salt}$${derived}`} WHERE id = ${user.id}`;
console.log("Password hash updated for the selected institute account.");
