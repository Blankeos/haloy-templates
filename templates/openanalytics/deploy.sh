#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t openanalytics-postgres
haloy deploy -t openanalytics-clickhouse
haloy deploy -t openanalytics-valkey-queue
haloy deploy -t openanalytics-valkey-realtime
haloy deploy -t openanalytics-keygen
haloy deploy -t openanalytics-geoip
haloy deploy -t openanalytics-migrate
haloy deploy -t openanalytics-gateway
haloy deploy -t openanalytics-api
haloy deploy -t openanalytics-collector
haloy deploy -t openanalytics-realtime
haloy deploy -t openanalytics-worker
haloy deploy -t openanalytics-web
haloy deploy -t openanalytics-edge
