#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t chatwoot-postgres
haloy deploy -t chatwoot-redis
haloy deploy -t chatwoot
haloy deploy -t chatwoot-worker
