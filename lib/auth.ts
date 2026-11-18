import { and, eq } from "drizzle-orm";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import { headers } from "next/headers";
import { db } from "../db";
import { institutes, users } from "../db/schema";
import { tenantFromHost } from "./tenant-host";
import { verifyPassword } from "./password";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  session: { strategy: "jwt", maxAge: 8 * 60 * 60 },
  pages: { signIn: "/login" },
  providers: [CredentialsProvider({
    name: "Email and password",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const email = credentials?.email?.trim().toLowerCase();
      const password = credentials?.password;
      const subdomain = tenantFromHost((await headers()).get("host"));
      if (!email || !password || !subdomain || password.length > 128) return null;

      const [record] = await db.select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        passwordHash: users.passwordHash,
        instituteId: institutes.id,
        instituteActive: institutes.isActive,
      }).from(users).innerJoin(institutes, eq(users.instituteId, institutes.id))
        .where(and(eq(users.email, email), eq(institutes.subdomain, subdomain), eq(users.isActive, true)))
        .limit(1);

      if (!record || !record.instituteActive || !(await verifyPassword(password, record.passwordHash))) return null;
      return { id: record.id, email: record.email, name: record.name, role: record.role, instituteId: record.instituteId, tenantSubdomain: subdomain };
    },
  })],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.role = user.role;
        token.instituteId = user.instituteId;
        token.tenantSubdomain = user.tenantSubdomain;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = token.role;
        session.user.instituteId = token.instituteId;
        session.user.tenantSubdomain = token.tenantSubdomain;
      }
      return session;
    },
  },
};
