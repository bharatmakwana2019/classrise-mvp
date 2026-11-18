import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { institutes } from "../db/schema";
import { TenantSignInForm } from "./tenant-sign-in-form";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

export async function TenantLogin({ subdomain }: { subdomain: string }) {
  const { db } = await import("../db");
  const [institute] = await db.select({
    id: institutes.id,
    name: institutes.name,
    logoUrl: institutes.logoUrl,
    tagline: institutes.tagline,
    isActive: institutes.isActive,
  }).from(institutes).where(eq(institutes.subdomain, subdomain)).limit(1);

  if (!institute || !institute.isActive) notFound();
  const { authOptions } = await import("../lib/auth");
  const session = await getServerSession(authOptions);
  if (session?.user.instituteId === institute.id && session.user.tenantSubdomain === subdomain) redirect("/dashboard");

  return <main className="tenant-login-page">
    <section className="tenant-login-card" aria-labelledby="tenant-login-heading">
      <a className="tenant-brand" href="/" aria-label={`${institute.name} home`}>
        {institute.logoUrl ? <img src={institute.logoUrl} alt={`${institute.name} logo`} /> : <span className="tenant-brand-name">{institute.name}</span>}
      </a>
      {institute.tagline && <p className="tenant-tagline">{institute.tagline}</p>}
      <span className="eyebrow">INSTITUTE PORTAL</span>
      <h1 id="tenant-login-heading">Welcome back</h1>
      <p className="tenant-login-lead">Sign in to continue to {institute.name}.</p>
      <TenantSignInForm instituteName={institute.name} />
      <p className="tenant-powered-by">Powered by <a href="https://madlyloaded.com">gurukulOS</a></p>
    </section>
  </main>;
}
