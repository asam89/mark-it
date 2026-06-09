#!/bin/bash
# Mark-It — Zero-downtime deployment script
# Run on the OCI instance to pull latest and redeploy
#
# Usage: ./deploy/scripts/deploy.sh [branch]

set -euo pipefail

BRANCH="${1:-init-main}"
APP_DIR="/opt/mark-it"

echo "═══════════════════════════════════════════════════════════"
echo "  Mark-It — Deploying branch: $BRANCH"
echo "═══════════════════════════════════════════════════════════"

cd "$APP_DIR"

# Pull latest code
echo "[1/4] Pulling latest code..."
git fetch origin
git checkout "$BRANCH"
git pull origin "$BRANCH"

# Rebuild app container only (postgres stays running)
echo "[2/4] Rebuilding application..."
docker compose build app

# Run database migrations
echo "[3/4] Running database migrations..."
docker compose run --rm app npx prisma db push --accept-data-loss=false

# Restart app with zero downtime
echo "[4/4] Restarting application..."
docker compose up -d --no-deps app

echo ""
echo "  Deploy complete! Check status:"
echo "  docker compose ps"
echo "  docker compose logs -f app"
echo "═══════════════════════════════════════════════════════════"
