FROM airbyte/workload-launcher:${AIRBYTE_VERSION}
COPY scripts/start-workload-launcher.sh /scripts/start-workload-launcher.sh
EXPOSE 8080
ENTRYPOINT ["sh","-c","exec /bin/sh /scripts/start-workload-launcher.sh /bin/bash -c \"airbyte-app/bin/${APPLICATION}\""]
CMD []
