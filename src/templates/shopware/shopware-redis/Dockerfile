FROM redis:7.4-alpine
CMD ["sh","-c","exec redis-server --appendonly yes --requirepass \"${REDIS_PASSWORD}\""]
