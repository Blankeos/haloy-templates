FROM redis:8.10.2-alpine
CMD ["/bin/sh","-ec","exec redis-server --requirepass \"$REDIS_PASSWORD\" --appendonly yes --maxmemory-policy noeviction"]
