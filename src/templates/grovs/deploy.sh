#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t grovs-postgres
haloy deploy -t grovs-redis
haloy deploy -t grovs-clickhouse
haloy deploy -t grovs-migrate
haloy deploy -t grovs-web
haloy deploy -t grovs-worker-1
haloy deploy -t grovs-worker-2
haloy deploy -t grovs-dashboard
