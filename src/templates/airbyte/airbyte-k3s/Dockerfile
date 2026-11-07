FROM rancher/k3s:${K3S_VERSION}
CMD ["server","--node-name=airbyte-k3s","--disable=traefik","--disable=servicelb","--disable=metrics-server","--disable=coredns","--tls-san=k3s"]
