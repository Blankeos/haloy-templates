#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t uptimekit-db
haloy deploy -t uptimekit-redis
haloy deploy -t uptimekit-dash
haloy deploy -t uptimekit-clickhouse
