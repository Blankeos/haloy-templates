#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t affinepro-db
haloy deploy -t affinepro-redis
haloy deploy -t affinepro-migration
haloy deploy -t affinepro
