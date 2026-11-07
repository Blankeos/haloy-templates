#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t huly-nginx
haloy deploy -t huly-mongodb
haloy deploy -t huly-minio
haloy deploy -t huly-elastic
haloy deploy -t huly-rekoni
haloy deploy -t huly-transactor
haloy deploy -t huly-collaborator
haloy deploy -t huly-account
haloy deploy -t huly-workspace
haloy deploy -t huly-front
haloy deploy -t huly-fulltext
haloy deploy -t huly-stats
