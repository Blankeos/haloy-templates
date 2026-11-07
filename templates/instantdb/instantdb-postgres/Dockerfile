FROM ghcr.io/instantdb/postgresql:postgresql-16-pg-hint-plan
EXPOSE 8080
CMD ["postgres","-c","wal_level=logical","-c","max_replication_slots=4","-c","max_wal_senders=4","-c","shared_preload_libraries=pg_hint_plan","-c","random_page_cost=1.1"]
