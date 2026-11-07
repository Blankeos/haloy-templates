FROM ruxwez/postgres:18-v1.1.0
CMD ["postgres","-c","shared_preload_libraries=pg_stat_statements,pg_cron","-c","cron.database_name=postgres","-c","max_worker_processes=32"]
