#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t frappe-lms-backend
haloy deploy -t frappe-lms-configurator
haloy deploy -t frappe-lms-websocket
haloy deploy -t frappe-lms-frontend
haloy deploy -t frappe-lms-queue-default
haloy deploy -t frappe-lms-queue-long
haloy deploy -t frappe-lms-queue-short
haloy deploy -t frappe-lms-scheduler
haloy deploy -t frappe-lms-create-site
haloy deploy -t frappe-lms-migration
haloy deploy -t frappe-lms-db
haloy deploy -t frappe-lms-redis-cache
haloy deploy -t frappe-lms-redis-queue
haloy deploy -t frappe-lms-redis-socketio
