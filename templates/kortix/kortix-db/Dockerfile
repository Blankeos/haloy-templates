FROM supabase/postgres:17.6.1.136@sha256:f371b5f3f2ac0a05703f33d6e6134515fb2498cab708fb948a0aeb7481467c00
ENTRYPOINT ["/bin/sh","-c","echo \"$KORTIX_BOOT\" | base64 -d | gzip -dc > /tmp/kortix-boot.sh && exec sh /tmp/kortix-boot.sh"]
