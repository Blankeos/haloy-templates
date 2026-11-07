#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t puppetflow-postgres-init-volumes
haloy deploy -t puppetflow-postgres-postgres
haloy deploy -t puppetflow-postgres-migrate
haloy deploy -t puppetflow-postgres-pinokio
haloy deploy -t puppetflow-postgres-redis
haloy deploy -t puppetflow-postgres-stream-server
haloy deploy -t puppetflow-postgres-puppetflow
haloy deploy -t puppetflow-postgres-queue-1
haloy deploy -t puppetflow-postgres-queue-2
haloy deploy -t puppetflow-postgres-scheduler
