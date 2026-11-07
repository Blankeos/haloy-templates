FROM alpine:3.22
EXPOSE 8080
ENTRYPOINT ["/bin/sh","-c"]
CMD ["set -e\nif [ ! -s /config/public.crt ]; then\n  apk add --no-cache openssl >/dev/null\n  openssl req -x509 -newkey rsa:2048 -nodes -days 3650 \\\n    -subj \"/CN=s3\" -addext \"subjectAltName=DNS:s3\" \\\n    -addext \"basicConstraints=critical,CA:TRUE\" \\\n    -keyout /config/private.key -out /config/public.crt\nfi\nprintf '{\"identities\":[{\"name\":\"feedbacks\",\"credentials\":[{\"accessKey\":\"%s\",\"secretKey\":\"%s\"}],\"actions\":[\"Admin\",\"Read\",\"Write\",\"List\",\"Tagging\"]}]}' \\\n  \"$S3_ACCESS_KEY_ID\" \"$S3_SECRET_ACCESS_KEY\" > /config/s3.json\nchmod 644 /config/*\n"]
