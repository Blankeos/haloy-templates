#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t puppetflow-init-volumes
haloy deploy -t puppetflow-migrate
haloy deploy -t puppetflow-pinokio
haloy deploy -t puppetflow-redis
haloy deploy -t puppetflow-stream-server
haloy deploy -t puppetflow
haloy deploy -t puppetflow-queue-1
haloy deploy -t puppetflow-queue-2
haloy deploy -t puppetflow-scheduler
