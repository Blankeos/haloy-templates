FROM chrislusf/seaweedfs:${SEAWEEDFS_VERSION}
EXPOSE 8080
ENTRYPOINT ["sh","-c","exec /bin/sh -ec \"mkdir -p /etc/seaweedfs\nprintf '{\\\"identities\\\":[{\\\"name\\\":\\\"airbyte\\\",\\\"credentials\\\":[{\\\"accessKey\\\":\\\"%s\\\",\\\"secretKey\\\":\\\"%s\\\"}],\\\"actions\\\":[\\\"Admin\\\",\\\"Read\\\",\\\"Write\\\",\\\"List\\\",\\\"Tagging\\\"]}]}' \\\n  \\\"${MINIO_ROOT_USER}\\\" \\\"${MINIO_ROOT_PASSWORD}\\\" > /etc/seaweedfs/s3.json\nexec weed server -dir=/storage -ip.bind=0.0.0.0 \\\n  -master.volumeSizeLimitMB=1024 -volume.max=0 \\\n  -s3 -s3.port=9000 -s3.config=/etc/seaweedfs/s3.json\n\""]
CMD []
