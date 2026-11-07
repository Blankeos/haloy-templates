#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t langfuse-postgres
haloy deploy -t langfuse-clickhouse
haloy deploy -t langfuse-minio
haloy deploy -t langfuse-redis
haloy deploy -t langfuse-worker
haloy deploy -t langfuse-web
