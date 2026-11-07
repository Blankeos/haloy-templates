#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t quant-ux-mongo
haloy deploy -t quant-ux-qux-be
haloy deploy -t quant-ux-qux-fe
haloy deploy -t quant-ux-qux-ws
