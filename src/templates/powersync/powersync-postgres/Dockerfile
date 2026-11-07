FROM postgres:17-alpine
COPY init-powersync.sql /docker-entrypoint-initdb.d/init-powersync.sql
CMD ["postgres","-c","wal_level=logical"]
