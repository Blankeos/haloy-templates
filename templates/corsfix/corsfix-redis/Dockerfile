FROM redis:7.4.11-alpine
CMD ["sh","-c","exec redis-server --requirepass \"${REDIS_PASSWORD}\" --appendonly yes"]
