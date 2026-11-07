FROM redis:7-alpine
CMD ["sh","-c","redis-server --appendonly yes --maxmemory 512mb --maxmemory-policy allkeys-lru --save 60 1000"]
