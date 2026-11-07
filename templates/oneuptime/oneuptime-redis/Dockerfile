FROM redis:7.0.12
CMD ["sh","-c","exec redis-server --requirepass \"${REDIS_PASSWORD}\" --save '' --appendonly no"]
