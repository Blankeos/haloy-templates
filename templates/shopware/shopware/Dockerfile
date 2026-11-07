FROM ${SHOPWARE_BASE_IMAGE:-shopware/docker-base:8.4.19-nginx}
ENTRYPOINT ["/bin/sh","-ec","export JWT_PRIVATE_KEY=\"$(cat /run/shopware-secrets/jwt-private.pem)\"\nexport JWT_PUBLIC_KEY=\"$(cat /run/shopware-secrets/jwt-public.pem)\"\nexec /usr/bin/supervisord -c /etc/supervisord.conf\n"]
