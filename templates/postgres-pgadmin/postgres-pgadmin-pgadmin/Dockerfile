FROM dpage/pgadmin4:9.17
ENTRYPOINT ["/bin/sh","-c","cp /pgadmin4/pgpass /var/lib/pgadmin/pgpass && chmod 600 /var/lib/pgadmin/pgpass && exec /entrypoint.sh"]
