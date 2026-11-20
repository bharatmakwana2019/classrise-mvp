import { headers } from "next/headers";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../lib/auth";
import { tenantFromHost } from "../../lib/tenant-host";
import { SignOutButton } from "../sign-out-button";
import { db } from "../../db";
import { institutes, users } from "../../db/schema";
import { and, eq } from "drizzle-orm";
import { TenantLogoManager } from "../tenant-logo-manager";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const subdomain = tenantFromHost((await headers()).get("host"));
  if (!session?.user?.id || !session.user.instituteId || !subdomain || session.user.tenantSubdomain !== subdomain) redirect("/login");
  const [account] = await db.select({ userId: users.id, instituteName: institutes.name, logoUrl: institutes.logoUrl }).from(users)
    .innerJoin(institutes, eq(users.instituteId, institutes.id))
    .where(and(
      eq(users.id, session.user.id),
      eq(users.instituteId, session.user.instituteId),
      eq(users.isActive, true),
      eq(institutes.subdomain, subdomain),
      eq(institutes.isActive, true),
    )).limit(1);
  if (!account) redirect("/login");

  return <main className="tenant-login-page">
    <section className="tenant-login-card dashboard-welcome-card">
      <span className="eyebrow">INSTITUTE PORTAL</span>
      <h1>Welcome, {session.user.name || session.user.email}</h1>
      <p className="tenant-login-lead">You are signed in to your institute workspace.</p>
      <div className="dashboard-account-details">
        <span>{session.user.email}</span>
        <span>{session.user.role}</span>
      </div>
      {session.user.role === "owner" && <TenantLogoManager instituteName={account.instituteName} logoUrl={account.logoUrl} />}
      <SignOutButton />
    </section>
  </main>;
}
