FROM curlimages/curl:8.15.0
EXPOSE 8080
ENTRYPOINT ["/bin/sh","-c"]
CMD ["while true; do curl --fail --silent --show-error --output /dev/null -H \"Authorization: Bearer ${CRON_SECRET}\" http://blogfactory-api:3000/api/cron/drain && echo \"Scheduler drain completed\"; sleep \"${CRON_INTERVAL_SECONDS}\"; done"]
