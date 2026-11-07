#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t erpnext-backend
haloy deploy -t erpnext-configurator
haloy deploy -t erpnext-websocket
haloy deploy -t erpnext-frontend
haloy deploy -t erpnext-queue-default
haloy deploy -t erpnext-queue-long
haloy deploy -t erpnext-queue-short
haloy deploy -t erpnext-scheduler
haloy deploy -t erpnext-create-site
haloy deploy -t erpnext-migration
haloy deploy -t erpnext-db
haloy deploy -t erpnext-redis-cache
haloy deploy -t erpnext-redis-queue
haloy deploy -t erpnext-redis-socketio
