FROM airbyte/workload-launcher:${AIRBYTE_VERSION}
COPY scripts/start-workload-launcher.sh /scripts/start-workload-launcher.sh
ENTRYPOINT ["/bin/sh","/scripts/start-workload-launcher.sh"]
CMD ["/bin/bash","-c","airbyte-app/bin/${APPLICATION}"]
