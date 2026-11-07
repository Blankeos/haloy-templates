FROM chrislusf/seaweedfs:4.48
ENTRYPOINT ["/bin/sh","-c"]
CMD ["set -e\nprintf '{\"identities\":[{\"name\":\"orbit\",\"credentials\":[{\"accessKey\":\"orbit\",\"secretKey\":\"%s\"}],\"actions\":[\"Admin\",\"Read\",\"Write\",\"List\",\"Tagging\"]}]}' \"$MINIO_PASSWORD\" > /tmp/s3.json\nexec weed server -dir=/data -ip.bind=0.0.0.0 -s3 -s3.port=9000 -s3.config=/tmp/s3.json\n"]
