#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t falco-redis
haloy deploy -t falco-ui
haloy deploy -t falcosidekick
haloy deploy -t falco
