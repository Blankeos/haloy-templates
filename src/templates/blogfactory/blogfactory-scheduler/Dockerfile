FROM curlimages/curl:8.15.0
ENTRYPOINT ["/bin/sh","-c"]
CMD ["sh","-c","exec \"while true; do curl --fail --silent --show-error --output /dev/null -H \\\"Authorization: Bearer ${CRON_SECRET}\\\" http://blogfactory-api:3000/api/cron/drain && echo \\\"Scheduler drain completed\\\"; sleep \\\"${CRON_INTERVAL_SECONDS}\\\"; done\""]
