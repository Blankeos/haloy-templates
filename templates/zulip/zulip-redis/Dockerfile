FROM redis:alpine
CMD ["sh","-euc","/usr/local/bin/docker-entrypoint.sh --requirepass \"$(cat $REDIS_PASSWORD_FILE)\""]
