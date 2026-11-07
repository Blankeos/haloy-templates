#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t itsaplan-postgres
haloy deploy -t itsaplan-minio
haloy deploy -t itsaplan-minio-init
haloy deploy -t itsaplan-migrate
haloy deploy -t itsaplan-api
haloy deploy -t itsaplan-worker
haloy deploy -t itsaplan-bot
haloy deploy -t itsaplan-web
