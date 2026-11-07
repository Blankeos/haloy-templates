#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t postiz-postgres
haloy deploy -t postiz-redis
haloy deploy -t postiz-temporal-postgresql
haloy deploy -t postiz-temporal-elasticsearch
haloy deploy -t postiz-temporal
haloy deploy -t postiz-app
