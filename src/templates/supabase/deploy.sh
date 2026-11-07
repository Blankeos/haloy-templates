#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
set -a; [ -f .env ] && . ./.env; set +a

# Haloy has no depends_on: deploy in dependency order.
haloy deploy -t supabase-studio
haloy deploy -t supabase-api-gw
haloy deploy -t supabase-db
haloy deploy -t supabase-auth
haloy deploy -t supabase-rest
haloy deploy -t supabase-realtime
haloy deploy -t supabase-imgproxy
haloy deploy -t supabase-storage
haloy deploy -t supabase-meta
haloy deploy -t supabase-functions
haloy deploy -t supabase-supavisor
