#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t airbyte-db
haloy deploy -t airbyte-minio
haloy deploy -t airbyte-minio-init
haloy deploy -t airbyte-temporal
haloy deploy -t airbyte-k3s
haloy deploy -t airbyte-docker-dns
haloy deploy -t airbyte-k3s-bootstrap
haloy deploy -t airbyte-bootloader
haloy deploy -t airbyte-dataplane-credentials
haloy deploy -t airbyte-server
haloy deploy -t airbyte-manifest-server
haloy deploy -t airbyte-workload-api-server
haloy deploy -t airbyte-worker
haloy deploy -t airbyte-cron
haloy deploy -t airbyte-workload-launcher
