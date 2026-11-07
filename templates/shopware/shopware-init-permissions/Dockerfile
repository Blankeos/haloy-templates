FROM alpine:3.21
EXPOSE 8080
CMD ["sh","-ec","mkdir -p \\\n  /var/www/html/files \\\n  /var/www/html/public/theme \\\n  /var/www/html/public/media \\\n  /var/www/html/public/thumbnail \\\n  /var/www/html/public/sitemap \\\n  /run/shopware-secrets\nchown -R 82:82 /var/www/html /run/shopware-secrets\n"]
