#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t plane-db
haloy deploy -t plane-redis
haloy deploy -t plane-mq
haloy deploy -t plane-migrator
haloy deploy -t plane-api
haloy deploy -t plane-worker
haloy deploy -t plane-web
haloy deploy -t plane-space
haloy deploy -t plane-admin
haloy deploy -t plane-live
haloy deploy -t plane-beat-worker
haloy deploy -t plane-minio
haloy deploy -t plane-proxy
