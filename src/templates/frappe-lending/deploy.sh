#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t frappe-lending-configurator
haloy deploy -t frappe-lending-create-site
haloy deploy -t frappe-lending-backend
haloy deploy -t frappe-lending-websocket
haloy deploy -t frappe-lending-frontend
haloy deploy -t frappe-lending-queue-default
haloy deploy -t frappe-lending-queue-long
haloy deploy -t frappe-lending-queue-short
haloy deploy -t frappe-lending-scheduler
haloy deploy -t frappe-lending-migration
haloy deploy -t frappe-lending-db
haloy deploy -t frappe-lending-redis-cache
haloy deploy -t frappe-lending-redis-queue
haloy deploy -t frappe-lending-redis-socketio
