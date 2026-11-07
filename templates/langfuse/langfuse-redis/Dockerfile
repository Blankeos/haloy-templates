FROM docker.io/redis:7
CMD ["sh","-c","exec --requirepass \"${REDIS_AUTH}\" --maxmemory-policy noeviction"]
