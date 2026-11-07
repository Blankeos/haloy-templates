FROM temporalio/admin-tools:1.25.2-tctl-1.18.1-cli-1.1.1@sha256:da0c7a7982b571857173ab8f058e7f139b3054800abb4dcb100445d29a563ee8
COPY scripts/mirror-name-search.sh /etc/temporal/entrypoint.sh
ENTRYPOINT ["sh","/etc/temporal/entrypoint.sh"]
