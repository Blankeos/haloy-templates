FROM redis:7.4.7-alpine
CMD ["redis-server","--maxmemory","512mb","--maxmemory-policy","allkeys-lru","--maxmemory-samples","5"]
