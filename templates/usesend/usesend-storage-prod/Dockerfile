FROM minio/minio:latest
ENTRYPOINT ["sh","-c","sh"]
CMD ["sh","-c","-c 'mkdir -p /data/usesend && minio server /data --console-address \":9001\" --address \":9002\"'"]
