#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t usesend-db-prod
haloy deploy -t usesend-redis-prod
haloy deploy -t usesend-storage-prod
haloy deploy -t usesend
