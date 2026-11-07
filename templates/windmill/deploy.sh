#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t windmill-postgres
haloy deploy -t windmill-server
haloy deploy -t windmill-worker
haloy deploy -t windmill-worker-native
haloy deploy -t windmill-lsp
haloy deploy -t windmill-caddy
