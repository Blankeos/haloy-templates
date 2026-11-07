FROM postgres:18-alpine@sha256:eca6fb2d91fda290eb8cfb8ba53dd0dcbf3508a08011e30adb039ea7c8e1e9f2
COPY postgresql.conf /etc/postgresql.conf
COPY docker-entrypoint-initdb.d /docker-entrypoint-initdb.d/
CMD ["-c","config_file=/etc/postgresql.conf"]
