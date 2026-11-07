FROM ghcr.io/billmora/billmora:latest
EXPOSE 8080
CMD ["php","artisan","queue:work","--sleep=3","--tries=3","--max-time=3600"]
