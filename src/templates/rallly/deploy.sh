#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t rallly-db
haloy deploy -t rallly-minio
haloy deploy -t rallly-minio-init
haloy deploy -t rallly
