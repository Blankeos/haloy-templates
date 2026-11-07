FROM busybox:1.36
COPY application.yml /opt/Lavalink/application.yml
CMD ["sh","-c","sh -c \"mkdir -p /opt/Lavalink/plugins &&\n       chmod -R 0777 /opt/Lavalink/plugins || true &&\n       chown -R 1000:1000 /opt/Lavalink/plugins || true &&\n       echo perms-fixed && sleep 1\"\n"]
