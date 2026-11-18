import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { TenantLogin } from "../tenant-login";
import { tenantFromHost } from "../../lib/tenant-host";

type LoginPageProps = { searchParams: Promise<{ institute?: string }> };

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host");
  const subdomain = tenantFromHost(host);
  if (subdomain) return <TenantLogin subdomain={subdomain} />;

  const { institute } = await searchParams;
  if (institute) {
    const candidate = institute.trim().toLowerCase();
    if (/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(candidate)) {
      const baseDomain = (process.env.TENANT_BASE_DOMAIN || "madlyloaded.com").toLowerCase().replace(/^https?:\/\//, "").split("/")[0];
      if (process.env.NODE_ENV !== "production" && baseDomain === "madlyloaded.com" && host?.includes("localhost")) {
        redirect(`http://${candidate}.localhost:${host.split(":")[1] || "3000"}/login`);
      }
      redirect(`https://${candidate}.${baseDomain}/login`);
    }
  }

  return <main className="tenant-login-page">
    <section className="tenant-login-card tenant-picker-card" aria-labelledby="tenant-picker-heading">
      <a className="tenant-brand tenant-brand-fallback" href="/">gurukulOS</a>
      <span className="eyebrow">INSTITUTE PORTAL</span>
      <h1 id="tenant-picker-heading">Find your institute</h1>
      <p className="tenant-login-lead">Enter your institute subdomain to open its branded sign-in page.</p>
      <form action="/login" method="get" className="tenant-picker-form">
        <label htmlFor="institute-subdomain">Institute subdomain</label>
        <div className="tenant-subdomain-field">
          <input id="institute-subdomain" name="institute" autoComplete="organization" placeholder="your-institute" pattern="[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?" required />
          <span>.{process.env.TENANT_BASE_DOMAIN || "madlyloaded.com"}</span>
        </div>
        <button className="green-button" type="submit">Continue</button>
      </form>
      <p className="tenant-powered-by">New to gurukulOS? <a href="/onboarding">Create your institute</a></p>
    </section>
  </main>;
}
