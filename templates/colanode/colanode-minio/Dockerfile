FROM minio/minio:RELEASE.2025-04-08T15-41-24Z
EXPOSE 8080
ENTRYPOINT ["sh"]
CMD ["-c","mkdir -p /data/colanode-avatars /data/colanode-files && minio server /data --address \":9000\" --console-address \":9001\""]
