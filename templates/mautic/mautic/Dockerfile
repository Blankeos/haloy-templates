FROM mautic/mautic:5.1.1-apache
ENTRYPOINT ["/bin/sh","-c","chown -R www-data:www-data /var/www/html && /entrypoint.sh apache2-foreground"]
