FROM ghcr.io/lavalink-devs/lavalink:4
COPY application.yml /opt/Lavalink/application.yml
ENTRYPOINT ["sh","-c","sh -c 'until [ -w /opt/Lavalink/plugins ] ; do\n          echo \"waiting for /opt/Lavalink/plugins to be writable\";\n          sleep 1;\n       done;\n       exec java -jar /opt/Lavalink/Lavalink.jar'\n"]
