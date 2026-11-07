#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t ethora-core-config
haloy deploy -t ethora-core-mongo
haloy deploy -t ethora-core-mongo-init
haloy deploy -t ethora-core-mysql
haloy deploy -t ethora-core-redis
haloy deploy -t ethora-core-minio
haloy deploy -t ethora-core-centrifugo
haloy deploy -t ethora-core-xmpp
haloy deploy -t ethora-core-api
haloy deploy -t ethora-core-jobs
haloy deploy -t ethora-core-init
haloy deploy -t ethora-core-verify
haloy deploy -t ethora-core-frontend
haloy deploy -t ethora-core-gateway
