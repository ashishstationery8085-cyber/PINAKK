#!/usr/bin/env bash
# Usage: ./scripts/deploy_prod.sh user@host /remote/path
# Copies repo files needed for production and runs docker compose up

set -euo pipefail

REMOTE=${1:-}
REMOTE_DIR=${2:-/opt/pinakk}

if [ -z "$REMOTE" ]; then
  echo "Usage: $0 user@host [remote_dir]"
  exit 1
fi

echo "Creating temporary archive..."
tmpfile=$(mktemp /tmp/pinakk-XXXXX.tar.gz)

tar -czf "$tmpfile" \
  docker-compose.prod.yml deploy/nginx.conf server/.env.example client/.env.production.example .github/workflows/ci.yml docker-compose.yml server/Dockerfile client/Dockerfile README.md

echo "Uploading to $REMOTE:$REMOTE_DIR..."
ssh "$REMOTE" "mkdir -p $REMOTE_DIR"
scp "$tmpfile" "$REMOTE":"$REMOTE_DIR/"
ssh "$REMOTE" "cd $REMOTE_DIR && tar -xzf $(basename $tmpfile) && rm $(basename $tmpfile)"

echo "On remote: pulling images and starting services"
ssh "$REMOTE" "cd $REMOTE_DIR && docker compose -f docker-compose.prod.yml pull && docker compose -f docker-compose.prod.yml up -d --remove-orphans"

echo "Deployment triggered."
