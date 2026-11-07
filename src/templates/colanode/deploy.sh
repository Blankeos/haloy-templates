#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t colanode-postgres
haloy deploy -t colanode-valkey
haloy deploy -t colanode-minio
haloy deploy -t colanode-server
