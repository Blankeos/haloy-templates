#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t dify-init-permissions
haloy deploy -t dify-db
haloy deploy -t dify-redis
haloy deploy -t dify-api
haloy deploy -t dify-web
haloy deploy -t dify-plugin-daemon
haloy deploy -t dify-nginx
haloy deploy -t dify-worker
haloy deploy -t dify-worker-beat
haloy deploy -t dify-sandbox
haloy deploy -t dify-ssrf-proxy
