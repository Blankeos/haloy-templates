FROM cgr.dev/chainguard/minio
ENTRYPOINT ["sh"]
CMD ["-c","mkdir -p /data/langfuse && minio server --address \":9000\" --console-address \":9001\" /data"]
