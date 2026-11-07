FROM chrislusf/seaweedfs:${SEAWEEDFS_VERSION}
COPY scripts/init-minio.sh /scripts/init-minio.sh
EXPOSE 8080
ENTRYPOINT ["/bin/sh","/scripts/init-minio.sh"]
