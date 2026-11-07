FROM rancher/mirrored-coredns-coredns:${COREDNS_VERSION}
COPY config/docker-dns.Corefile /etc/coredns/Corefile
EXPOSE 8080
CMD ["-conf","/etc/coredns/Corefile"]
