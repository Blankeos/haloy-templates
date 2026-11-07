FROM rancher/k3s:${K3S_VERSION}
COPY config/k3s-resources.yaml /config/k3s-resources.yaml
COPY scripts/bootstrap-k3s.sh /scripts/bootstrap-k3s.sh
ENTRYPOINT ["/bin/sh","/scripts/bootstrap-k3s.sh"]
