#!/bin/bash
# Mark-It PostgreSQL backup script
# Called by systemd timer (markit-backup.timer) daily at 2AM

set -euo pipefail

BACKUP_DIR="/opt/mark-it/backups"
RETENTION_DAYS=7
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
CONTAINER_NAME="markit-db"

mkdir -p "$BACKUP_DIR"

echo "[$(date)] Starting database backup..."

docker exec "$CONTAINER_NAME" pg_dump \
  -U "${POSTGRES_USER:-markit}" \
  -d "${POSTGRES_DB:-markit}" \
  --format=custom \
  --compress=9 \
  > "$BACKUP_DIR/markit_${TIMESTAMP}.dump"

echo "[$(date)] Backup complete: markit_${TIMESTAMP}.dump"

# Cleanup old backups
find "$BACKUP_DIR" -name "markit_*.dump" -mtime +"$RETENTION_DAYS" -delete
echo "[$(date)] Cleaned backups older than ${RETENTION_DAYS} days"
