FROM clickhouse/clickhouse-server:25.10.2.65
COPY clickhouse_config /etc/clickhouse-server/config.d/
COPY clickhouse_users /etc/clickhouse-server/users.d/
COPY clickhouse_init /docker-entrypoint-initdb.d/
