#!/bin/bash
# Mark-It — OCI Ampere A1 Initial Setup Script
# Run this on a fresh Ubuntu 22.04+ ARM64 instance
#
# Usage: curl -sSL <raw-url> | sudo bash
# Or:    sudo bash deploy/scripts/setup-oci.sh

set -euo pipefail

echo "═══════════════════════════════════════════════════════════"
echo "  Mark-It — OCI Ampere A1 Server Setup"
echo "═══════════════════════════════════════════════════════════"

# ─── System Updates ───────────────────────────────────────────────────────────
echo "[1/7] Updating system packages..."
apt-get update && apt-get upgrade -y
apt-get install -y \
  curl \
  git \
  ufw \
  fail2ban \
  unattended-upgrades

# ─── Docker Installation ──────────────────────────────────────────────────────
echo "[2/7] Installing Docker..."
if ! command -v docker &> /dev/null; then
  curl -fsSL https://get.docker.com | sh
  systemctl enable --now docker
  usermod -aG docker ubuntu
fi

# ─── Docker Compose Plugin ────────────────────────────────────────────────────
echo "[3/7] Verifying Docker Compose..."
docker compose version || {
  apt-get install -y docker-compose-plugin
}

# ─── Firewall Configuration ──────────────────────────────────────────────────
echo "[4/7] Configuring firewall..."
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw --force enable

# ─── Application Directory ────────────────────────────────────────────────────
echo "[5/7] Setting up application directory..."
mkdir -p /opt/mark-it
if [ ! -d /opt/mark-it/.git ]; then
  git clone https://github.com/asam89/mark-it.git /opt/mark-it
fi
chown -R ubuntu:ubuntu /opt/mark-it

# ─── Environment File ────────────────────────────────────────────────────────
echo "[6/7] Creating environment file..."
if [ ! -f /opt/mark-it/.env ]; then
  cp /opt/mark-it/.env.example /opt/mark-it/.env
  # Generate a random NEXTAUTH_SECRET
  GENERATED_SECRET=$(openssl rand -base64 32)
  sed -i "s|your-secret-here-generate-with-openssl-rand-base64-32|${GENERATED_SECRET}|" /opt/mark-it/.env
  echo ""
  echo "╔══════════════════════════════════════════════════════════╗"
  echo "║  IMPORTANT: Edit /opt/mark-it/.env with your secrets!   ║"
  echo "║  nano /opt/mark-it/.env                                 ║"
  echo "╚══════════════════════════════════════════════════════════╝"
  echo ""
fi

# ─── Systemd Services ─────────────────────────────────────────────────────────
echo "[7/7] Installing systemd services..."
cp /opt/mark-it/deploy/systemd/markit.service /etc/systemd/system/
cp /opt/mark-it/deploy/systemd/markit-backup.service /etc/systemd/system/
cp /opt/mark-it/deploy/systemd/markit-backup.timer /etc/systemd/system/
systemctl daemon-reload
systemctl enable markit.service
systemctl enable markit-backup.timer

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  Setup complete!"
echo ""
echo "  Next steps:"
echo "  1. Edit secrets:    nano /opt/mark-it/.env"
echo "  2. Start app:       systemctl start markit"
echo "  3. Get TLS cert:    docker compose run --rm certbot certonly \\"
echo "                        --webroot -w /var/www/certbot \\"
echo "                        -d mark-it.io -d www.mark-it.io"
echo "  4. Check status:    docker compose ps"
echo "  5. View logs:       docker compose logs -f app"
echo "═══════════════════════════════════════════════════════════"
