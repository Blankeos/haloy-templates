FROM redis:8.8
CMD ["/bin/sh","-c","exec redis-server --requirepass \"$REDIS_PASSWORD\" --save \"\" --appendonly no"]
