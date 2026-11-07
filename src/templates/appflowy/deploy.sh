#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t appflowy-nginx
haloy deploy -t appflowy-minio
haloy deploy -t appflowy-postgres
haloy deploy -t appflowy-redis
haloy deploy -t appflowy-gotrue
haloy deploy -t appflowy-cloud
haloy deploy -t appflowy-admin-frontend
haloy deploy -t appflowy-ai
haloy deploy -t appflowy-worker
haloy deploy -t appflowy-web
