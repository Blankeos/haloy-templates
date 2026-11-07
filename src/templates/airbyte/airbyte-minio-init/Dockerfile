FROM chrislusf/seaweedfs:${SEAWEEDFS_VERSION}
COPY scripts/init-minio.sh /scripts/init-minio.sh
ENTRYPOINT ["/bin/sh","/scripts/init-minio.sh"]
