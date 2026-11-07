FROM rancher/k3s:${K3S_VERSION}
COPY scripts/export-dataplane-credentials.sh /scripts/export-dataplane-credentials.sh
EXPOSE 8080
ENTRYPOINT ["/bin/sh","/scripts/export-dataplane-credentials.sh"]
