FROM cgr.dev/chainguard/minio
ENTRYPOINT ["sh","-c","sh"]
CMD ["sh","-c","-c 'mkdir -p /data/langfuse && minio server --address \":9000\" --console-address \":9001\" /data'"]
