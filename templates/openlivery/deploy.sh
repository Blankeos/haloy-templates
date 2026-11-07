#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t openlivery-db
haloy deploy -t openlivery-api
haloy deploy -t openlivery-web
haloy deploy -t openlivery
haloy deploy -t openlivery-whatsapp
