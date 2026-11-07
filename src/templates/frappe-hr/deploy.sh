#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t frappe-hr-backend
haloy deploy -t frappe-hr-configurator
haloy deploy -t frappe-hr-websocket
haloy deploy -t frappe-hr-frontend
haloy deploy -t frappe-hr-queue-default
haloy deploy -t frappe-hr-queue-long
haloy deploy -t frappe-hr-queue-short
haloy deploy -t frappe-hr-scheduler
haloy deploy -t frappe-hr-create-site
haloy deploy -t frappe-hr-migration
haloy deploy -t frappe-hr-db
haloy deploy -t frappe-hr-redis-cache
haloy deploy -t frappe-hr-redis-queue
haloy deploy -t frappe-hr-redis-socketio
