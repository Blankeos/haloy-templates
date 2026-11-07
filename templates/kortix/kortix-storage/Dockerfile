FROM supabase/storage-api:v1.60.4@sha256:c8eb9858eafec891a97c27125470aaad54703c3f4eb4d55ca7f1bf6c6411febf
ENTRYPOINT ["/bin/sh","-c","echo \"$KORTIX_BOOT\" | base64 -d | gzip -dc > /tmp/kortix-boot.sh && exec sh /tmp/kortix-boot.sh"]
