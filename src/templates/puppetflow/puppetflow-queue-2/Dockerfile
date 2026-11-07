FROM ghcr.io/puppetflow/puppetflow:v2026.11.7
CMD ["php","artisan","queue:work","--queue=2","--tries=1","--timeout=630","--sleep=3","--max-jobs=500","--max-time=3600"]
