#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t mediacms-redis
haloy deploy -t mediacms-db
haloy deploy -t mediacms-migrations
haloy deploy -t mediacms-web
haloy deploy -t mediacms-celery-beat
haloy deploy -t mediacms-celery-worker
