FROM redis:7-alpine
CMD ["sh","-c","exec redis-server --save 60 1 --loglevel warning --requirepass \"${REDIS_PASSWORD}\""]
