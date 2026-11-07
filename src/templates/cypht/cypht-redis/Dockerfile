FROM redis:7-alpine
CMD ["sh","-c","exec redis-server --requirepass \"$REDIS_PASSWORD\" --appendonly yes --maxmemory 256mb --maxmemory-policy volatile-lru"]
