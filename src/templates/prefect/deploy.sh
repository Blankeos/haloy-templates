#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t prefect-postgres
haloy deploy -t prefect-redis
haloy deploy -t prefect
haloy deploy -t prefect-services
haloy deploy -t prefect-worker
