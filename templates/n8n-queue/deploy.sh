#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t n8n-queue-postgres
haloy deploy -t n8n-queue-redis
haloy deploy -t n8n-queue-n8n
haloy deploy -t n8n-queue-n8n-worker
