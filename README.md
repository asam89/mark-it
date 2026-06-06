# Mark-It

AI-Powered Small Business Marketing Platform — your intelligent marketing operating system.

## Overview

Mark-It uses large language models to deeply understand each business, its industry, location, and regulatory constraints, then provides intelligent marketing strategy recommendations, channel management, budget allocation, and ROI tracking — all from a single dashboard.

## Tech Stack

- **Frontend:** Next.js 14 (App Router), React, Tailwind CSS
- **Backend:** Next.js API Routes (Route Handlers)
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** NextAuth.js (email/password + Google OAuth)
- **AI/LLM:** OpenAI GPT-4o + Anthropic Claude (configurable)
- **Payments:** Stripe (subscription billing)
- **Deployment:** Vercel (frontend) + managed PostgreSQL

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

## License

Proprietary — All rights reserved.
