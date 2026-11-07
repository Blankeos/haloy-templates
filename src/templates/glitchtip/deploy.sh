#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t glitchtip-postgres
haloy deploy -t glitchtip-valkey
haloy deploy -t glitchtip-web
haloy deploy -t glitchtip-worker
haloy deploy -t glitchtip-migrate
