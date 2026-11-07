#!/bin/sh

set -eu

client_id_file=/credentials/dataplane-client-id
client_secret_file=/credentials/dataplane-client-secret

[ -s "$client_id_file" ] || {
  echo "Missing generated data-plane client ID." >&2
  exit 1
}

[ -s "$client_secret_file" ] || {
  echo "Missing generated data-plane client secret." >&2
  exit 1
}

DATAPLANE_CLIENT_ID=$(cat "$client_id_file")
DATAPLANE_CLIENT_SECRET=$(cat "$client_secret_file")
export DATAPLANE_CLIENT_ID DATAPLANE_CLIENT_SECRET

exec /entrypoint.sh "$@"
