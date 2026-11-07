#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t karakeep-web
haloy deploy -t karakeep-chrome
haloy deploy -t karakeep-meilisearch
