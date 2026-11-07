FROM prom/prometheus:v3.15.1
EXPOSE 8080
CMD ["--config.file=/etc/prometheus/prometheus.yml","--storage.tsdb.path=/prometheus","--storage.tsdb.retention.time=30d"]
