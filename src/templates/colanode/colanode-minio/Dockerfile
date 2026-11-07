FROM minio/minio:RELEASE.2025-04-08T15-41-24Z
ENTRYPOINT ["sh","-c","sh"]
CMD ["sh","-c","-c 'mkdir -p /data/colanode-avatars /data/colanode-files && minio server /data --address \":9000\" --console-address \":9001\"'"]
