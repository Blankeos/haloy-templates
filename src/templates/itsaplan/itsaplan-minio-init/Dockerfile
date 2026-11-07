FROM rustfs/rustfs:1.0.0
ENTRYPOINT ["/bin/sh","-c","curl -fsS -X PUT --aws-sigv4 aws:amz:us-east-1:s3 --user \"$S3_ACCESS_KEY_ID:$S3_SECRET_ACCESS_KEY\" \"http://itsaplan-minio:9000/$S3_BUCKET\" && echo \"bucket ready: $S3_BUCKET\""]
