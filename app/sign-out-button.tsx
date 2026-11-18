"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return <button className="dashboard-signout" type="button" onClick={() => signOut({ callbackUrl: "/login" })}>Sign out</button>;
}
