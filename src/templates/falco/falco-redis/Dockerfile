FROM redis/redis-stack-server:7.4.0-v8
CMD ["sh","-c","exec /opt/redis-stack/bin/redis-server --dir /data --loadmodule /opt/redis-stack/lib/redisearch.so --loadmodule /opt/redis-stack/lib/rejson.so --requirepass \"${REDIS_PASSWORD}\" --appendonly yes --appendfsync everysec --maxmemory 512mb --maxmemory-policy noeviction"]
