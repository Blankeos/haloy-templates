FROM busybox:1.36
EXPOSE 8080
CMD ["sh","-c","FLAG_FILE=\"/app/api/storage/.init_permissions\"\nif [ -f \"$FLAG_FILE\" ]; then\n  echo \"Permissions already initialized.\"\n  exit 0\nfi\necho \"Initializing permissions for /app/api/storage\"\nchown -R 1001:1001 /app/api/storage && touch \"$FLAG_FILE\"\n"]
