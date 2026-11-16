# ClassRise MVP

Initial Next.js foundation for a multi-tenant SaaS learning platform. Demo tenant: **XYZ Classes** (95 students, Standards 8–10).

## Local start

1. Copy `.env.example` to `.env.local` and fill only local development values.
2. Run `npm install`.
3. Run `npm run dev` and open `http://localhost:3000`.

## Day 1 decisions

- Tenant isolation: every institute-owned record carries `institute_id`; database access will enforce this in the application layer and, once selected, PostgreSQL row-level security.
- Roles: institute owner/admin, teacher, student, and parent. Permissions are explicit and server-checked; UI visibility is not authorization.
- Authentication: email/password or magic-link provider through a maintained Next.js-compatible auth library; sessions use secure, HTTP-only cookies. Final provider selection waits until deployment/database choices are confirmed.
- Deployment: GitHub repository connected to Vercel; preview deployments per pull request; production deployment only after explicit approval. `classrise.madlyloaded.com` is reserved but DNS remains unchanged.
