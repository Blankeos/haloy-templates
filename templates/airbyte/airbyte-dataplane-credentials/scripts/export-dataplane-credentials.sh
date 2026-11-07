#!/bin/sh

set -eu

kubeconfig=/kube/config.yaml
namespace=default
secret_name=airbyte-auth-secrets
credentials_dir=/credentials
client_id_file="$credentials_dir/dataplane-client-id"
client_secret_file="$credentials_dir/dataplane-client-secret"
client_id_tmp="$credentials_dir/.dataplane-client-id.$$"
client_secret_tmp="$credentials_dir/.dataplane-client-secret.$$"

umask 022
mkdir -p "$credentials_dir"
trap 'rm -f "$client_id_tmp" "$client_secret_tmp"' 0 1 2 15

client_id_b64=$(
  /bin/kubectl --kubeconfig "$kubeconfig" --namespace "$namespace" get secret "$secret_name" -o 'jsonpath={.data.dataplane-client-id}'
)
client_secret_b64=$(
  /bin/kubectl --kubeconfig "$kubeconfig" --namespace "$namespace" get secret "$secret_name" -o 'jsonpath={.data.dataplane-client-secret}'
)

[ -n "$client_id_b64" ] || {
  echo "The bootloader did not create a data-plane client ID." >&2
  exit 1
}
[ -n "$client_secret_b64" ] || {
  echo "The bootloader did not create a data-plane client secret." >&2
  exit 1
}

printf '%s' "$client_id_b64" | base64 -d > "$client_id_tmp"
printf '%s' "$client_secret_b64" | base64 -d > "$client_secret_tmp"

client_id=$(cat "$client_id_tmp")
if ! printf '%s' "$client_id" | grep -Eq '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$'; then
  echo "The bootloader returned an invalid data-plane client ID." >&2
  exit 1
fi

mv -f "$client_id_tmp" "$client_id_file"
mv -f "$client_secret_tmp" "$client_secret_file"
trap - 0 1 2 15
