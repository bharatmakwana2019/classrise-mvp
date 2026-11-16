# Deployment plan

1. Create a private GitHub repository and push this project.
2. Import the repository into Vercel; configure environment variables in Vercel, never in Git.
3. Add a managed PostgreSQL provider and run migrations/seeds against preview first.
4. Verify preview auth, tenant isolation, role permissions, and database backups.
5. Explicitly approve production release.
6. Only then add the GoDaddy DNS record for `classrise.madlyloaded.com` to the Vercel-provided target and verify TLS.

No DNS or production action is authorized by this plan.
