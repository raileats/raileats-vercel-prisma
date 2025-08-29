# Raileats (Vercel-only, GitHub deploy)

This repo is a **single Next.js app** (frontend + backend via Route Handlers) designed to deploy **only on Vercel** through **GitHub**. No local CLI steps required.

## Deploy steps (GitHub → Vercel)

1. Push this folder to a new GitHub repository (e.g. `raileats`).
2. In Vercel, **New Project → Import Git Repository** → select your repo.
3. In **Environment Variables** (Production and Preview), add:

   - `DATABASE_URL` → from a serverless Postgres (Neon recommended). Use pooled string with `sslmode=require&pgbouncer=true`.
   - `JWT_SECRET` → a long random secret.

   - `COOKIE_NAME` → `raileats_token` (or your choice).

   - `SEED_TOKEN` → a one-time secret like `seed-123`.

4. Click **Deploy**.

## Seed initial data (one-time)

After deploy, call the seed API from your browser dev console or a tool like curl:

```
fetch("/api/dev/seed", { method: "POST", headers: { "x-seed-token": "<your SEED_TOKEN>" } })
  .then(r => r.json()).then(console.log);
```

This adds sample stations (`NDLS`, `PUNE`) and a few restaurants/menu items.

## App overview

- **Frontend**: Next.js App Router pages in `/app`.
- **Backend**: API under `/app/api/*` using Prisma to Postgres.
- **Auth**: email/password → JWT stored in HTTP-only cookie.
- **DB**: PostgreSQL via Prisma client.

## Notes

- Vercel will run `prisma generate` automatically on install because of the `postinstall` script.
- Use a pooled Postgres (Neon) for serverless reliability.
- You can remove `/app/api/dev/seed` after running once.
