FROM kortix/kortix-api:0.14.19
ENTRYPOINT ["/bin/sh","-c","echo \"$KORTIX_BOOT\" | base64 -d | gzip -dc > /tmp/kortix-boot.sh && exec sh /tmp/kortix-boot.sh"]
