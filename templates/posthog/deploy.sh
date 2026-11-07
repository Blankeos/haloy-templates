#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t posthog-init-assets
haloy deploy -t posthog-db
haloy deploy -t posthog-redis7
haloy deploy -t posthog-zookeeper
haloy deploy -t posthog-kafka
haloy deploy -t posthog-kafka-init
haloy deploy -t posthog-clickhouse
haloy deploy -t posthog-objectstorage
haloy deploy -t posthog-web
haloy deploy -t posthog-worker
haloy deploy -t posthog-plugins
haloy deploy -t posthog-ingestion-general
haloy deploy -t posthog-ingestion-sessionreplay
haloy deploy -t posthog-recording-api
haloy deploy -t posthog-capture
haloy deploy -t posthog-replay-capture
haloy deploy -t posthog-feature-flags
haloy deploy -t posthog-hypercache-server
haloy deploy -t posthog-livestream
haloy deploy -t posthog-proxy
