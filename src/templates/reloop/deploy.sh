#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t reloop-proxy
haloy deploy -t reloop-links
haloy deploy -t reloop-dashboard
haloy deploy -t reloop-postgres
haloy deploy -t reloop-redis
haloy deploy -t reloop-nats
haloy deploy -t reloop-migrate
haloy deploy -t reloop-auth
haloy deploy -t reloop-domain
haloy deploy -t reloop-api-key
haloy deploy -t reloop-webhook
haloy deploy -t reloop-contacts
haloy deploy -t reloop-mail
haloy deploy -t reloop-logs
haloy deploy -t reloop-workflow
haloy deploy -t reloop-upload
haloy deploy -t reloop-template
haloy deploy -t reloop-campaigns
haloy deploy -t reloop-inbox
haloy deploy -t reloop-email
haloy deploy -t reloop-spam
haloy deploy -t reloop-smtp
haloy deploy -t reloop-inbound
