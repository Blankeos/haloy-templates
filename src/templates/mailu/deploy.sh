#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t mailu-redis
haloy deploy -t mailu-admin
haloy deploy -t mailu-front
haloy deploy -t mailu-imap
haloy deploy -t mailu-smtp
haloy deploy -t mailu-antispam
haloy deploy -t mailu-webmail
