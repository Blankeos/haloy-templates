#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t rybbit-clickhouse
haloy deploy -t rybbit-postgres
haloy deploy -t rybbit-redis
haloy deploy -t rybbit-backend
haloy deploy -t rybbit-client
