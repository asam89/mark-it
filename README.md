# Mark-It

AI-Powered Small Business Marketing Platform — your intelligent marketing operating system.

**Domain:** `mark-it.io` (pending purchase — see [Domain Setup](#domain-setup) below)

## Overview

Mark-It uses large language models to deeply understand each business, its industry, location, and regulatory constraints, then provides intelligent marketing strategy recommendations, channel management, budget allocation, and ROI tracking — all from a single dashboard.

## Tech Stack

- **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS
- **Backend:** Next.js API Routes (Route Handlers)
- **Database:** PostgreSQL + Prisma 7 ORM
- **Auth:** NextAuth.js (email/password + Google OAuth + Microsoft Azure AD)
- **AI/LLM:** OpenAI GPT-4o + Anthropic Claude (configurable via `LLM_PROVIDER`)
- **Payments:** Stripe (subscription billing)
- **Deployment:** Vercel (frontend) + managed PostgreSQL (Neon/Supabase)

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- npm

### Setup

```bash
# Install dependencies
npm install

# Copy env template
cp .env.example .env
# Fill in your environment variables

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

See `.env.example` for all required variables. Key ones:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Random secret for session encryption |
| `LLM_PROVIDER` | `openai` or `anthropic` |
| `OPENAI_API_KEY` | OpenAI API key (if using OpenAI) |
| `ANTHROPIC_API_KEY` | Anthropic API key (if using Anthropic) |

## Architecture

```
src/
├── app/
│   ├── (auth)/          # Login/signup pages
│   ├── (dashboard)/     # Protected dashboard pages
│   ├── api/             # Route handlers (REST API)
│   └── page.tsx         # Landing page
├── components/
│   ├── ui/              # Reusable UI primitives
│   ├── dashboard/       # Dashboard-specific components
│   └── onboarding/      # AI onboarding chat
├── config/
│   └── prompts.ts       # Externalized LLM prompts
└── lib/
    ├── ai.ts            # LLM service (OpenAI + Anthropic)
    ├── auth.ts          # NextAuth configuration
    ├── db.ts            # Prisma client singleton
    └── validations.ts   # Zod schemas
```

## Features (Phase 1 MVP)

- [x] User signup with email verification
- [x] AI-driven business profiling (conversational intake)
- [x] Configurable LLM (OpenAI / Anthropic)
- [x] Marketing channel connection management
- [x] AI budget allocation engine
- [x] Unified analytics dashboard
- [x] ROI "Worth-It" meter
- [x] Manual lead tracking
- [x] Subscription tiers via Stripe
- [x] Marketing campaigns with goals & progress tracking
- [x] Microsoft Azure AD + Google OAuth sign-in

## Domain Setup

**Target domain:** `mark-it.io`

### Purchase Steps

1. Check availability at your preferred registrar (Namecheap, Cloudflare, Google Domains)
2. Purchase the `.io` domain (~$30-50/year)
3. Configure DNS:
   - If using **Vercel**: Add domain in Vercel project settings → it provides A/CNAME records
   - If using **Cloudflare**: Point nameservers to Cloudflare, then proxy to your hosting
4. Update `NEXTAUTH_URL` in production env to `https://mark-it.io`
5. Update OAuth redirect URIs in Google Cloud Console and Azure AD app registration

### OAuth Redirect URIs (Production)

| Provider | Redirect URI |
|----------|-------------|
| Google | `https://mark-it.io/api/auth/callback/google` |
| Microsoft | `https://mark-it.io/api/auth/callback/azure-ad` |

## Production Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Set all environment variables in Vercel dashboard → Settings → Environment Variables.

### Database (Neon / Supabase)

1. Create a PostgreSQL database on [Neon](https://neon.tech) or [Supabase](https://supabase.com)
2. Copy the connection string to `DATABASE_URL`
3. Run `npx prisma db push` to sync schema

## Marketing Campaigns

The campaigns module helps marketing teams:

| Use Case | Goal Type | KPI |
|----------|-----------|-----|
| Grand opening | Foot Traffic | Store visits |
| Seasonal sale | Sales/Conversions | Orders |
| Brand launch | Brand Awareness | Impressions |
| Lead magnet | Lead Generation | Form submissions |
| Event promo | Event Registrations | RSVPs |
| Content push | Engagement | Likes/comments/shares |
| Retargeting | Website Traffic | Clicks |
| Referral program | Referrals | Sign-ups |

## License

Proprietary — All rights reserved.
