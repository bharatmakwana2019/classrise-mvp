import type { DefaultSession } from "next-auth";
import type { userRole } from "../db/schema";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id?: string;
      role?: typeof userRole.enumValues[number];
      instituteId?: string;
      tenantSubdomain?: string;
    };
  }

  interface User {
    role: typeof userRole.enumValues[number];
    instituteId: string;
    tenantSubdomain: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: typeof userRole.enumValues[number];
    instituteId?: string;
    tenantSubdomain?: string;
  }
}
