FROM mysql:8.4.11
ENTRYPOINT ["/bin/sh","-c"]
CMD ["mysql --host=azerothcore-database --user=root --execute=\"UPDATE acore_auth.realmlist SET name = 'AzerothCore', address = '${REALM_ADDRESS}', localAddress = '127.0.0.1', localSubnetMask = '255.255.255.0', port = 8085 WHERE id = 1;\""]
