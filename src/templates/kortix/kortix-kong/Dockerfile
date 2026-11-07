FROM kong/kong:3.9.1@sha256:6addf50e6bd8d578314cb9ce4f2d2d1e3781d2edecef59f707e00c6e05d384f5
ENTRYPOINT ["/bin/sh","-c","echo \"$KORTIX_BOOT\" | base64 -d | gzip -dc > /tmp/kortix-boot.sh && exec sh /tmp/kortix-boot.sh"]
