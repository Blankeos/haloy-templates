#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t orbit-postgres
haloy deploy -t orbit-redis
haloy deploy -t orbit-storage
haloy deploy -t orbit-bucket
haloy deploy -t orbit-web
haloy deploy -t orbit-realtime
haloy deploy -t orbit-scheduler
haloy deploy -t orbit
