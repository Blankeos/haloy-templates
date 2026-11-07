FROM alpine:3.22
EXPOSE 8080
ENTRYPOINT ["/bin/sh","-c"]
CMD ["set -e\napk add --no-cache curl >/dev/null\nfor i in $(seq 1 60); do\n  code=$(curl -s -o /dev/null -w '%{http_code}' --cacert /config/public.crt \\\n    --aws-sigv4 \"aws:amz:us-east-1:s3\" --user \"$S3_ACCESS_KEY_ID:$S3_SECRET_ACCESS_KEY\" \\\n    -X PUT \"https://feedbacks-s3:8333/$S3_BUCKET\") || code=000\n  case \"$code\" in 200|409) echo \"bucket ready ($code)\"; exit 0;; esac\n  sleep 2\ndone\necho \"could not create bucket (last HTTP $code)\"; exit 1\n"]
