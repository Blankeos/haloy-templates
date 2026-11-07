FROM rabbitmq:4.2
CMD ["sh","-euc","export RABBITMQ_DEFAULT_PASS=\"$(cat $RABBITMQ_PASSWORD_FILE)\"\necho \"default_user = $RABBITMQ_DEFAULT_USER\" >> /etc/rabbitmq/rabbitmq.conf\necho \"default_pass = $RABBITMQ_DEFAULT_PASS\" >> /etc/rabbitmq/rabbitmq.conf\nexec docker-entrypoint.sh rabbitmq-server\n"]
