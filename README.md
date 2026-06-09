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

### Option A: OCI Ampere A1 (Self-Hosted — Recommended for Full Control)

Deploy to Oracle Cloud's Always Free ARM64 instances (4 OCPUs, 24GB RAM).

#### Prerequisites

- OCI account with an Ampere A1 compute instance (Ubuntu 22.04+ ARM64)
- Domain pointed to the instance's public IP (A record)
- SSH access to the instance

#### Quick Start (Automated)

```bash
# SSH into your OCI instance
ssh ubuntu@<your-instance-ip>

# Clone and run setup
git clone https://github.com/asam89/mark-it.git /opt/mark-it
sudo bash /opt/mark-it/deploy/scripts/setup-oci.sh
```

This installs Docker, configures the firewall, sets up systemd services, and prepares the app.

#### Manual Setup

```bash
# 1. Install Docker
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER

# 2. Clone repo
git clone https://github.com/asam89/mark-it.git /opt/mark-it
cd /opt/mark-it

# 3. Configure environment
cp .env.example .env
nano .env  # Fill in all secrets

# 4. Start everything
docker compose up -d

# 5. Run database migrations
docker compose exec app npx prisma db push

# 6. Get TLS certificate (after DNS is pointed)
sudo ./deploy/scripts/ssl-init.sh you@example.com
```

#### Architecture on OCI

```
Internet → OCI Public IP → Nginx (TLS :443)
                              ↓
                         Next.js App (:3000)
                              ↓
                         PostgreSQL (:5432)
```

All services run as Docker containers managed by `docker compose` + systemd.

#### OCI-Specific Configuration

| Setting | Value |
|---------|-------|
| Shape | VM.Standard.A1.Flex (ARM64) |
| OS | Ubuntu 22.04 Minimal (aarch64) |
| OCPUs | 2-4 (scale as needed within free tier) |
| Memory | 12-24 GB |
| Boot Volume | 50 GB |
| Ingress Rules | TCP 22, 80, 443 |

> **OCI Security List:** Ensure your VCN's security list allows inbound TCP on ports 22, 80, and 443.

#### Maintenance Commands

```bash
# View logs
docker compose logs -f app

# Redeploy after code changes
./deploy/scripts/deploy.sh init-main

# Manual database backup
./deploy/scripts/backup-db.sh

# Restart services
sudo systemctl restart markit

# Check status
docker compose ps
```

#### Automated Backups

PostgreSQL is backed up daily at 2AM via systemd timer. Backups are stored in `/opt/mark-it/backups/` with 7-day retention.

```bash
# Enable backup timer
sudo systemctl enable --now markit-backup.timer

# Check timer status
systemctl list-timers markit-backup.timer
```

---

### Option B: Vercel (Serverless — Simplest)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Set all environment variables in Vercel dashboard → Settings → Environment Variables.

### Database (Neon / Supabase)

For either deployment option, you need a PostgreSQL database:

1. **OCI (self-hosted):** Already included via Docker Compose — no external DB needed
2. **Vercel:** Create a PostgreSQL database on [Neon](https://neon.tech) or [Supabase](https://supabase.com)

Copy the connection string to `DATABASE_URL` and run `npx prisma db push` to sync schema.

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
