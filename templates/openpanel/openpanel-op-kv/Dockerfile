FROM redis:7.2.5-alpine
CMD ["sh","-c","exec redis-server --requirepass \"${REDIS_PASSWORD}\" --maxmemory-policy noeviction"]
