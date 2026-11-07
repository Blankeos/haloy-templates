#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t signoz-init-clickhouse
haloy deploy -t signoz-zookeeper-1
haloy deploy -t signoz-clickhouse
haloy deploy -t signoz-schema-migrator-sync
haloy deploy -t signoz
haloy deploy -t signoz-otel-collector
haloy deploy -t signoz-schema-migrator-async
