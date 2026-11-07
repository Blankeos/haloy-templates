FROM clickhouse/clickhouse-server:26.4.3-alpine
COPY clickhouse-config.xml /etc/clickhouse-server/config.d/appwrite.xml
COPY clickhouse-init.sh /docker-entrypoint-initdb.d/clickhouse-init.sh
