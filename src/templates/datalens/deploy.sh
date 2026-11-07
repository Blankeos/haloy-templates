#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t datalens-pg-compeng
haloy deploy -t datalens-pg-us
haloy deploy -t datalens-us
haloy deploy -t datalens-control-api
haloy deploy -t datalens-data-api
haloy deploy -t datalens
