#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t peerdb-catalog
haloy deploy -t peerdb-temporal
haloy deploy -t peerdb-temporal-admin-tools
haloy deploy -t peerdb-temporal-ui
haloy deploy -t peerdb-flow-api
haloy deploy -t peerdb-flow-snapshot-worker
haloy deploy -t peerdb-flow-worker
haloy deploy -t peerdb
haloy deploy -t peerdb-ui
haloy deploy -t peerdb-minio
