#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t erpnext-v16-backend
haloy deploy -t erpnext-v16-configurator
haloy deploy -t erpnext-v16-websocket
haloy deploy -t erpnext-v16-frontend
haloy deploy -t erpnext-v16-queue-default
haloy deploy -t erpnext-v16-queue-long
haloy deploy -t erpnext-v16-queue-short
haloy deploy -t erpnext-v16-scheduler
haloy deploy -t erpnext-v16-create-site
haloy deploy -t erpnext-v16-migration
haloy deploy -t erpnext-v16-db
haloy deploy -t erpnext-v16-redis-cache
haloy deploy -t erpnext-v16-redis-queue
haloy deploy -t erpnext-v16-redis-socketio
