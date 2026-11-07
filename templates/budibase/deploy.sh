#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t budibase-redis
haloy deploy -t budibase-minio
haloy deploy -t budibase-worker
haloy deploy -t budibase-apps
haloy deploy -t budibase-couchdb
haloy deploy -t budibase-proxy
