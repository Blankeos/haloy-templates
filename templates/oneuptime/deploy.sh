#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t oneuptime-postgres
haloy deploy -t oneuptime-redis
haloy deploy -t oneuptime-clickhouse
haloy deploy -t oneuptime
haloy deploy -t oneuptime-ingress
haloy deploy -t oneuptime-probe
