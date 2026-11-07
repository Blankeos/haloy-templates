FROM rancher/k3s:${K3S_VERSION}
COPY scripts/export-dataplane-credentials.sh /scripts/export-dataplane-credentials.sh
ENTRYPOINT ["/bin/sh","/scripts/export-dataplane-credentials.sh"]
