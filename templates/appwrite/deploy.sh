#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t appwrite-redis
haloy deploy -t appwrite-postgresql
haloy deploy -t appwrite-geo
haloy deploy -t appwrite-autogravity
haloy deploy -t appwrite-exiftool
haloy deploy -t appwrite
haloy deploy -t appwrite-console
haloy deploy -t appwrite-realtime
haloy deploy -t appwrite-mqtt
haloy deploy -t appwrite-worker
haloy deploy -t appwrite-task-scheduler
haloy deploy -t appwrite-task-maintenance
haloy deploy -t appwrite-task-interval
haloy deploy -t appwrite-browser
haloy deploy -t appwrite-clickhouse
haloy deploy -t appwrite-openruntimes-executor
haloy deploy -t appwrite-orchestrator
haloy deploy -t appwrite-mariadb
haloy deploy -t appwrite-mongodb
haloy deploy -t appwrite-gateway
