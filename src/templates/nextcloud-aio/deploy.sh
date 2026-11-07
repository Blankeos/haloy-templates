#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t nextcloud-aio-nextcloud-db
haloy deploy -t nextcloud-aio-nextcloud-redis
haloy deploy -t nextcloud-aio-nextcloud
haloy deploy -t nextcloud-aio-nextcloud-cron
