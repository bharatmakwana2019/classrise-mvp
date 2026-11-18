import { boolean, integer, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const userRole = pgEnum("user_role", ["owner", "staff", "teacher", "parent", "student"]);
export const moduleKey = pgEnum("module_key", ["students", "attendance", "fees", "timetable", "tests_results", "content", "reports", "communications"]);

export const institutes = pgTable("institutes", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  subdomain: text("subdomain").notNull().unique(),
  logoUrl: text("logo_url"),
  tagline: text("tagline"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const branches = pgTable("branches", {
  id: uuid("id").defaultRandom().primaryKey(),
  instituteId: uuid("institute_id").notNull().references(() => institutes.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  code: text("code").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  instituteId: uuid("institute_id").notNull().references(() => institutes.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  name: text("name").notNull(),
  role: userRole("role").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const instituteModules = pgTable("institute_modules", {
  id: uuid("id").defaultRandom().primaryKey(),
  instituteId: uuid("institute_id").notNull().references(() => institutes.id, { onDelete: "cascade" }),
  module: moduleKey("module").notNull(),
  enabled: boolean("enabled").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const students = pgTable("students", {
  id: uuid("id").defaultRandom().primaryKey(),
  instituteId: uuid("institute_id").notNull().references(() => institutes.id, { onDelete: "cascade" }),
  branchId: uuid("branch_id").notNull().references(() => branches.id, { onDelete: "cascade" }),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  admissionNumber: text("admission_number").notNull(),
  name: text("name").notNull(),
  standard: integer("standard").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const parents = pgTable("parents", {
  id: uuid("id").defaultRandom().primaryKey(),
  instituteId: uuid("institute_id").notNull().references(() => institutes.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  phone: text("phone"),
});

export const studentParents = pgTable("student_parents", {
  studentId: uuid("student_id").notNull().references(() => students.id, { onDelete: "cascade" }),
  parentId: uuid("parent_id").notNull().references(() => parents.id, { onDelete: "cascade" }),
});

export const teachers = pgTable("teachers", {
  id: uuid("id").defaultRandom().primaryKey(),
  instituteId: uuid("institute_id").notNull().references(() => institutes.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  subject: text("subject"),
});
