# ClassRise MVP

Initial Next.js foundation for a multi-tenant SaaS learning platform. Demo tenant: **XYZ Classes** (95 students, Standards 8–10).

## Local start

1. Copy `.env.example` to `.env.local` and fill only local development values.
2. Run `npm install`.
3. Run `npm run dev` and open `http://localhost:3000`.

## Day 1 decisions

- Tenant isolation: every institute-owned record carries `institute_id`; database access will enforce this in the application layer and, once selected, PostgreSQL row-level security.
- Roles: institute owner/admin, teacher, student, and parent. Permissions are explicit and server-checked; UI visibility is not authorization.
- Authentication: tenant-scoped email/password credentials through NextAuth. Passwords are stored as scrypt hashes and sessions use HTTP-only JWT cookies. Paid onboarding creates the owner's credential; seed credentials are supplied with `ADHYAYAN_OWNER_PASSWORD`.
- Deployment: GitHub repository connected to Vercel; preview deployments per pull request; production deployment only after explicit approval. `classrise.madlyloaded.com` is reserved but DNS remains unchanged.

## Tenant sign-in

Set `TENANT_BASE_DOMAIN`, `NEXT_PUBLIC_TENANT_BASE_DOMAIN`, and `NEXTAUTH_URL` for the deployment. Tenant hostnames such as `institute.madlyloaded.com` resolve to that institute's branded sign-in page. In development, use `institute.localhost:3000`. Apply the Drizzle migrations before starting the app. Existing users without a password hash need an administrator-assisted credential setup before they can sign in.

To set or reset a user's password, provide `TARGET_SUBDOMAIN`, `TARGET_EMAIL`, and `TARGET_PASSWORD` in the environment, then run `npm run auth:set-password`. The password is hashed before it is stored.
