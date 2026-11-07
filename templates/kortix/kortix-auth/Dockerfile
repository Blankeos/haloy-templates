FROM supabase/gotrue:v2.189.0@sha256:385184459f57569c54c25209f51f3b2be99ddd7c4ce9e3555b5d3eea8447b7cf
ENTRYPOINT ["/bin/sh","-c","echo \"$KORTIX_BOOT\" | base64 -d | gzip -dc > /tmp/kortix-boot.sh && exec sh /tmp/kortix-boot.sh"]
