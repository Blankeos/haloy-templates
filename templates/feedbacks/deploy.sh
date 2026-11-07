#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t feedbacks-postgres
haloy deploy -t feedbacks-s3-init
haloy deploy -t feedbacks-s3
haloy deploy -t feedbacks-s3-bucket
haloy deploy -t feedbacks
