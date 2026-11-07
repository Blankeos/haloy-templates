#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t novu-redis
haloy deploy -t novu-mongodb
haloy deploy -t novu-api
haloy deploy -t novu-worker
haloy deploy -t novu-ws
haloy deploy -t novu
