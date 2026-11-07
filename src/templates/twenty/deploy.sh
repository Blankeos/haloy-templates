#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t twenty-change-vol-ownership
haloy deploy -t twenty-postgres
haloy deploy -t twenty-server
haloy deploy -t twenty-worker
haloy deploy -t twenty-redis
