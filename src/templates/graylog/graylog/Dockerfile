FROM graylog/graylog:7.1.9
ENTRYPOINT ["/usr/bin/tini","--","/bin/bash","-ec","export GRAYLOG_ROOT_PASSWORD_SHA2=\"$(printf '%s' \"$GRAYLOG_ADMIN_PASSWORD\" | sha256sum | cut -d ' ' -f 1)\"\nunset GRAYLOG_ADMIN_PASSWORD\nexec /docker-entrypoint.sh\n"]
