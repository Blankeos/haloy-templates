FROM ${IMAGE_NAME:-frappe/erpnext}:${VERSION:-v15}
EXPOSE 8080
ENTRYPOINT ["bash","-c"]
CMD ["[[ ${REGENERATE_APPS_TXT} == \"1\" ]] && ls -1 apps > sites/apps.txt; [[ -n `grep -hs ^ sites/common_site_config.json | jq -r \".db_host // empty\"` ]] && exit 0; bench set-config -g db_host $DB_HOST; bench set-config -gp db_port $DB_PORT; bench set-config -g redis_cache \"redis://$REDIS_CACHE\"; bench set-config -g redis_queue \"redis://$REDIS_QUEUE\"; bench set-config -g redis_socketio \"redis://$REDIS_QUEUE\"; bench set-config -gp socketio_port $SOCKETIO_PORT;\n"]
