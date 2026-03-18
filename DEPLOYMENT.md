# FoodRescue — Deployment Guide

This guide covers deploying FoodRescue to **Vercel** with a **Neon PostgreSQL** database.

---

## Required Environment Variables

| Variable | Description | Where to get it |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | Neon dashboard → Project → Connection string (pooled) |
| `AUTH_SECRET` | NextAuth signing secret (≥32 chars) | `openssl rand -hex 32` |
| `IYZICO_API_KEY` | iyzico API key | iyzico merchant dashboard → Settings → API Keys |
| `IYZICO_SECRET_KEY` | iyzico secret key | iyzico merchant dashboard → Settings → API Keys |
| `IYZICO_BASE_URL` | iyzico API endpoint | Sandbox: `https://sandbox-api.iyzipay.com` / Production: `https://api.iyzipay.com` |
| `RESEND_API_KEY` | Resend email API key | resend.com → API Keys *(optional — emails silently skipped if missing)* |
| `EMAIL_FROM` | Verified sender address | Resend verified domain, e.g. `FoodRescue <noreply@yourdomain.com>` |
| `NEXT_PUBLIC_APP_URL` | Your production URL | Your Vercel deployment URL, e.g. `https://foodrescue.vercel.app` |

Copy `.env.example` to `.env.local` for local development and fill in the values.

---

## Step 1 — Set Up the Production Database (Neon)

1. Go to [neon.tech](https://neon.tech) and create a free account.
2. Click **New Project**, choose a region close to your users (e.g. EU Central for Turkey).
3. Copy the **Pooled connection string** from the dashboard:
   - Dashboard → Project → **Connection Details** → toggle **Pooled connection**
   - It looks like: `postgresql://user:pass@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require`
4. Save this as `DATABASE_URL` in your Vercel environment variables.

### Run Migrations on Production

After setting `DATABASE_URL` in your local `.env.local` pointing to the Neon database:

```bash
npx prisma migrate deploy
```

This applies all migrations in `prisma/migrations/` without re-running already-applied ones.

### Seed Production Data (Optional)

To seed realistic test data:

```bash
DATABASE_URL="your-neon-connection-string" npx tsx prisma/seed.ts
```

> ⚠️ Only run the seed on a fresh database — it creates test users, businesses, and boxes.

---

## Step 2 — Deploy to Vercel

### 2.1 Connect Repository

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
2. Click **Add New → Project**.
3. Select the `foodrescue-app` repository.
4. Vercel auto-detects Next.js. Leave the framework preset as **Next.js**.

### 2.2 Configure Environment Variables

In the Vercel project settings → **Environment Variables**, add each variable from the table above.

Set all variables for **Production**, **Preview**, and **Development** environments as appropriate.

Key points:
- `NEXT_PUBLIC_APP_URL` must be your exact Vercel URL (e.g. `https://foodrescue-app.vercel.app`). iyzico uses this for payment callback redirects.
- `IYZICO_BASE_URL` should be `https://sandbox-api.iyzipay.com` for preview/staging and `https://api.iyzipay.com` for production.

### 2.3 Deploy

Click **Deploy**. Vercel will:
1. Run `npm install` → triggers `postinstall: prisma generate`
2. Run `npm run build` → runs `prisma generate && next build`
3. Serve the app globally via Vercel Edge Network.

### 2.4 Verify Deployment

Visit `/api/health` — it should return:

```json
{ "status": "ok", "timestamp": 1234567890 }
```

---

## Step 3 — Switch iyzico from Sandbox to Production

1. Log in to your **live** iyzico merchant account at [merchant.iyzipay.com](https://merchant.iyzipay.com).
2. Go to **Settings → API Keys** and copy the live API key and secret.
3. In Vercel → Environment Variables, update:
   - `IYZICO_API_KEY` → live key
   - `IYZICO_SECRET_KEY` → live secret
   - `IYZICO_BASE_URL` → `https://api.iyzipay.com`
4. Set `NEXT_PUBLIC_APP_URL` to your production domain so iyzico redirects correctly after payment.
5. Redeploy (Vercel → Deployments → Redeploy, or push a new commit).

> ⚠️ Test with a real card in production before going live. iyzico production requires KVK registration and merchant agreement.

---

## Step 4 — Custom Domain (Optional)

1. Vercel → Project → **Settings → Domains**.
2. Add your domain (e.g. `foodrescue.com.tr`).
3. Update your DNS records as instructed by Vercel (usually a CNAME or A record).
4. Update `NEXT_PUBLIC_APP_URL` to your custom domain and redeploy.
5. Update the iyzico merchant dashboard with your production callback URL:
   - Callback URL: `https://yourdomain.com/api/payment/callback`

---

## Local Development

```bash
# Install dependencies
npm install

# Copy and fill environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Generate Prisma client
npx prisma generate

# Apply migrations to local/dev database
npx prisma migrate dev

# Run development server
npm run dev
```

The app runs at `http://localhost:3000`.

---

## Useful Commands

```bash
# Generate Prisma client (after schema changes)
npx prisma generate

# Apply migrations to production
npx prisma migrate deploy

# Open Prisma Studio (database GUI)
npx prisma studio

# Seed the database
npx tsx prisma/seed.ts

# Run production build locally
npm run build && npm start

# Check health endpoint
curl https://your-app.vercel.app/api/health
```
