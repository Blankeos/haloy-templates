#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t billmora-db
haloy deploy -t billmora-redis
haloy deploy -t billmora-app
haloy deploy -t billmora-worker
haloy deploy -t billmora-scheduler
