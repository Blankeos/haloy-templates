FROM chrislusf/seaweedfs:4.34
EXPOSE 8080
ENTRYPOINT ["/bin/sh","-c","echo \"Waiting for SeaweedFS to initialise...\"\nsleep 12\necho \"Creating S3 buckets...\"\nprintf 's3.bucket.create -name fluxer\\ns3.bucket.create -name fluxer-uploads\\ns3.bucket.create -name fluxer-downloads\\ns3.bucket.create -name fluxer-reports\\ns3.bucket.create -name fluxer-harvests\\nexit\\n' | weed shell -master=fluxer-seaweedfs:9333 2>&1 &\nWEED_PID=$!\nsleep 15\nkill $WEED_PID 2>/devnull || true\necho \"buckets ready\"\n"]
