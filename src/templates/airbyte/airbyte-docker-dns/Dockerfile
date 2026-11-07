FROM rancher/mirrored-coredns-coredns:${COREDNS_VERSION}
COPY config/docker-dns.Corefile /etc/coredns/Corefile
CMD ["-conf","/etc/coredns/Corefile"]
