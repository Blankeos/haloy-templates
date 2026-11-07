FROM ${SHOPWARE_BASE_IMAGE:-shopware/docker-base:8.4.19-nginx}
EXPOSE 8080
ENTRYPOINT ["/bin/sh","-ec","export JWT_PRIVATE_KEY=\"$(cat /run/shopware-secrets/jwt-private.pem)\"\nexport JWT_PUBLIC_KEY=\"$(cat /run/shopware-secrets/jwt-public.pem)\"\nexec php bin/console scheduled-task:run\n"]
