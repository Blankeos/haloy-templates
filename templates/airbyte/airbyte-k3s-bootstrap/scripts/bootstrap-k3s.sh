#!/bin/sh
set -eu

source_config=/kube/kubeconfig.yaml
client_config=/kube/config.yaml

until [ -s "$source_config" ]; do
  sleep 1
done

sed 's|server: https://127.0.0.1:6443|server: https://k3s:6443|' "$source_config" > "$client_config"
chmod 0644 "$client_config"

/bin/kubectl --kubeconfig "$client_config" config set-context --current --namespace=default >/dev/null

until /bin/kubectl --kubeconfig "$client_config" get --raw=/readyz >/dev/null 2>&1; do
  sleep 2
done

/bin/kubectl --kubeconfig "$client_config" apply -f /config/k3s-resources.yaml

/bin/kubectl --kubeconfig "$client_config" --namespace kube-system rollout status deployment/coredns --timeout=180s

/bin/kubectl --kubeconfig "$client_config" create secret generic airbyte-auth-secrets --namespace default --from-literal=instance-admin-password="$AIRBYTE_ADMIN_PASSWORD" --from-literal=instance-admin-client-id="$AIRBYTE_ADMIN_CLIENT_ID" --from-literal=instance-admin-client-secret="$AIRBYTE_ADMIN_CLIENT_SECRET" --from-literal=jwt-signature-secret="$AIRBYTE_JWT_SIGNATURE_SECRET" --from-literal=dataplane-client-id= --from-literal=dataplane-client-secret= --dry-run=client -o yaml | /bin/kubectl --kubeconfig "$client_config" apply -f -

/bin/kubectl --kubeconfig "$client_config" create secret generic airbyte-airbyte-secrets --namespace default --from-literal=AIRBYTE_DUMMY_SECRET=dummy --from-literal=AB_INSTANCE_ADMIN_PASSWORD="$AIRBYTE_ADMIN_PASSWORD" --from-literal=AB_INSTANCE_ADMIN_CLIENT_ID="$AIRBYTE_ADMIN_CLIENT_ID" --from-literal=AB_INSTANCE_ADMIN_CLIENT_SECRET="$AIRBYTE_ADMIN_CLIENT_SECRET" --from-literal=AB_JWT_SIGNATURE_SECRET="$AIRBYTE_JWT_SIGNATURE_SECRET" --from-literal=DATABASE_USER="$DATABASE_USER" --from-literal=DATABASE_PASSWORD="$DATABASE_PASSWORD" --from-literal=CONFIG_DATABASE_REPLICA_USER="$DATABASE_USER" --from-literal=CONFIG_DATABASE_REPLICA_PASSWORD="$DATABASE_PASSWORD" --from-literal=AWS_ACCESS_KEY_ID="$MINIO_ROOT_USER" --from-literal=AWS_SECRET_ACCESS_KEY="$MINIO_ROOT_PASSWORD" --from-literal=DATAPLANE_CLIENT_ID= --from-literal=DATAPLANE_CLIENT_SECRET= --dry-run=client -o yaml | /bin/kubectl --kubeconfig "$client_config" apply -f -

