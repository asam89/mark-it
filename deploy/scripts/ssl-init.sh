#!/bin/bash
# Mark-It — Initial SSL certificate setup
# Run AFTER the app is running on port 80 (nginx must be serving ACME challenges)
#
# Usage: sudo ./deploy/scripts/ssl-init.sh your-email@example.com

set -euo pipefail

EMAIL="${1:-}"
DOMAIN="mark-it.io"

if [ -z "$EMAIL" ]; then
  echo "Usage: $0 <your-email@example.com>"
  echo "Email is required for Let's Encrypt certificate notifications."
  exit 1
fi

APP_DIR="/opt/mark-it"
cd "$APP_DIR"

echo "═══════════════════════════════════════════════════════════"
echo "  Requesting TLS certificate for ${DOMAIN}"
echo "═══════════════════════════════════════════════════════════"

# Request certificate
docker compose run --rm certbot certonly \
  --webroot \
  -w /var/www/certbot \
  -d "$DOMAIN" \
  -d "www.$DOMAIN" \
  --email "$EMAIL" \
  --agree-tos \
  --no-eff-email

# Reload nginx to pick up new certs
docker compose exec nginx nginx -s reload

echo ""
echo "  TLS certificate installed successfully!"
echo "  Auto-renewal is handled by the certbot container."
echo "═══════════════════════════════════════════════════════════"
