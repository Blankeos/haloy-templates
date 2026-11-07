#!/bin/sh

set -eu

for bucket in airbyte-bucket state-storage airbyte-dev-logs; do
  until echo "s3.bucket.list" | weed shell -master="$SEAWEEDFS_MASTER" 2>/dev/null | grep -q "^[[:space:]]*$bucket[[:space:]]"; do
    echo "s3.bucket.create -name $bucket" | weed shell -master="$SEAWEEDFS_MASTER" >/dev/null 2>&1 || true
    sleep 2
  done
  echo "bucket $bucket ready"
done
