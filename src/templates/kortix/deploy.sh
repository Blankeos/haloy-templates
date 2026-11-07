#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t kortix-db
haloy deploy -t kortix-auth
haloy deploy -t kortix-rest
haloy deploy -t kortix-storage
haloy deploy -t kortix-kong
haloy deploy -t kortix-api
haloy deploy -t kortix-gateway
haloy deploy -t kortix-frontend
