FROM prefecthq/prefect:3.7.5-python3.12
EXPOSE 8080
CMD ["sh","-c","case \"$USE_AUTH\" in\n  [Tt]rue|1|[Yy]es) export PREFECT_API_AUTH_STRING=\"$PREFECT_AUTH_USER:$PREFECT_AUTH_PASSWORD\"; echo \"Prefect basic auth enabled\" ;;\nesac\nexec prefect worker start --pool local-pool\n"]
