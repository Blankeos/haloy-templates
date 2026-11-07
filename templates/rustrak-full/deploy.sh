#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t rustrak-full-postgres
haloy deploy -t rustrak-full-rustrak-server
haloy deploy -t rustrak-full-rustrak-ui
