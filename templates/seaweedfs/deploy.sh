#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t seaweedfs-master
haloy deploy -t seaweedfs-volume
haloy deploy -t seaweedfs-filer
haloy deploy -t seaweedfs-s3
