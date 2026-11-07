#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t librechat-mongodb
haloy deploy -t librechat-vectordb
haloy deploy -t librechat-rag-api
haloy deploy -t librechat
haloy deploy -t librechat-meilisearch
