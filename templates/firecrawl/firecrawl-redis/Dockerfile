FROM redis:7-alpine@sha256:ff02b58f971e7d7d156a1267e283fcbbeee91773b6aa36c49dac28ecfe28eadf
CMD ["sh","-c","exec /bin/sh -ec \"exec redis-server --bind 0.0.0.0 --appendonly yes --requirepass \\\"${REDIS_PASSWORD}\\\"\""]
