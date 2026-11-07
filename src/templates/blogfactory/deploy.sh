#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t blogfactory-postgres
haloy deploy -t blogfactory-minio
haloy deploy -t blogfactory-api
haloy deploy -t blogfactory-web
haloy deploy -t blogfactory-scheduler
