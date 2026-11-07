#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t openproject-db
haloy deploy -t openproject-cache
haloy deploy -t openproject-seeder
haloy deploy -t openproject-web
haloy deploy -t openproject-worker
haloy deploy -t openproject-cron
