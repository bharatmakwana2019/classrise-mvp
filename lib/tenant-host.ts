const reservedHosts = new Set(["www", "app", "api", "admin", "mail"]);

export function tenantFromHost(hostHeader: string | null, baseDomain = process.env.TENANT_BASE_DOMAIN || "madlyloaded.com") {
  if (!hostHeader) return null;
  const host = hostHeader.toLowerCase().split(":")[0].replace(/\.$/, "");
  const rootDomain = baseDomain.toLowerCase().split(":")[0].replace(/^\.+|\.+$/g, "");
  let prefix: string | null = null;

  if (host.endsWith(`.${rootDomain}`)) prefix = host.slice(0, -(rootDomain.length + 1));
  else if (process.env.NODE_ENV !== "production" && host.endsWith(".localhost")) prefix = host.slice(0, -".localhost".length);

  if (!prefix || prefix.includes(".") || !/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(prefix) || reservedHosts.has(prefix)) return null;
  return prefix;
}
