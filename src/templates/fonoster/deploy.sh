#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t fonoster-dashboard
haloy deploy -t fonoster-postgres
haloy deploy -t fonoster-apiserver
haloy deploy -t fonoster-autopilot
haloy deploy -t fonoster-routr
haloy deploy -t fonoster-rtpengine
haloy deploy -t fonoster-asterisk
haloy deploy -t fonoster-influxdb
haloy deploy -t fonoster-nats
haloy deploy -t fonoster-envoy
