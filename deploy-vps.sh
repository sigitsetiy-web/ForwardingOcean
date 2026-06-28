#!/bin/bash
set -e

APP_DIR=/opt/ForwardingOcean
TMP=/tmp/fms-deploy-$$
REPO=https://github.com/sigitsetiy-web/ForwardingOcean.git

echo "==> Clone latest from GitHub..."
git clone --depth 1 -b main "$REPO" "$TMP"

echo "==> Backup env files..."
mkdir -p /tmp/fms-env-backup
cp -a "$APP_DIR"/.env* /tmp/fms-env-backup/ 2>/dev/null || true

echo "==> Sync files..."
rsync -a --delete \
  --exclude node_modules \
  --exclude .next \
  --exclude '.env' \
  --exclude '.env.local' \
  --exclude '.env.production' \
  --exclude '.env.vercel' \
  --exclude '.env.example' \
  "$TMP"/ "$APP_DIR"/

echo "==> Restore env files..."
cp -a /tmp/fms-env-backup/. "$APP_DIR"/ 2>/dev/null || true
rm -rf "$TMP"

cd "$APP_DIR"
echo "==> npm install..."
npm install --no-audit --no-fund

echo "==> Build..."
npm run build

echo "==> Restart PM2..."
chmod +x "$APP_DIR"/start.sh 2>/dev/null || true
pm2 restart keyocean
pm2 save

echo "==> Deploy selesai."
