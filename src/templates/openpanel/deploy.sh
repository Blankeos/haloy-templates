#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t openpanel-op-db
haloy deploy -t openpanel-op-kv
haloy deploy -t openpanel-op-ch
haloy deploy -t openpanel-op-api
haloy deploy -t openpanel-op-dashboard
haloy deploy -t openpanel-op-worker
