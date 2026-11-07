#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t reactive-resume-postgres
haloy deploy -t reactive-resume-minio
haloy deploy -t reactive-resume-chrome
haloy deploy -t reactive-resume-app
haloy deploy -t reactive-resume-gateway
