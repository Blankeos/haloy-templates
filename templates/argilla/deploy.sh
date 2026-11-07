#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t argilla-elasticsearch
haloy deploy -t argilla-db
haloy deploy -t argilla-redis
haloy deploy -t argilla-web
haloy deploy -t argilla-worker
