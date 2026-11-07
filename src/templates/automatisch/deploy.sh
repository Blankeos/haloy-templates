#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t automatisch-postgres
haloy deploy -t automatisch-redis
haloy deploy -t automatisch
haloy deploy -t automatisch-worker
