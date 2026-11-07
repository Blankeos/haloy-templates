FROM minio/mc:latest
ENTRYPOINT ["sh","-c","/bin/sh -c \" until mc alias set local http://rallly-minio:9000 rallly ${S3_SECRET_ACCESS_KEY}; do sleep 2; done; mc mb --ignore-existing local/rallly; \"\n"]
