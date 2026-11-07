#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t struxa-mysql
haloy deploy -t struxa-minio
haloy deploy -t struxa-migrate
haloy deploy -t struxa
haloy deploy -t struxa-watchkeeper
