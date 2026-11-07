FROM redis:7-alpine
CMD ["sh","-c","exec redis-server --requirepass \"${REDIS_PASSWORD}\" --appendonly yes --dir /data"]
