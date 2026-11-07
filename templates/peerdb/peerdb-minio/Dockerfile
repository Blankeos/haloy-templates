FROM minio/minio:latest@sha256:14cea493d9a34af32f524e538b8346cf79f3321eff8e708c1e2960462bd8936e
ENTRYPOINT ["/bin/sh","-c"," minio server /data --console-address=:9001 & sleep 2; mc alias set myminiopeerdb http://peerdb-minio:9000 $MINIO_ROOT_USER $MINIO_ROOT_PASSWORD; mc mb myminiopeerdb/$PEERDB_CLICKHOUSE_AWS_S3_BUCKET_NAME; wait "]
