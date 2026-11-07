#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t sim-db
haloy deploy -t sim-migrations
haloy deploy -t sim-realtime
haloy deploy -t simstudio
haloy deploy -t sim-gateway
