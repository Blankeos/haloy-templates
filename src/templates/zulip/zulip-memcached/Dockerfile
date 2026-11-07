FROM memcached:alpine
CMD ["sh","-euc","echo 'mech_list: plain' > \"$SASL_CONF_PATH\"\necho \"zulip@$HOSTNAME:$(cat $MEMCACHED_PASSWORD_FILE)\" > \"$MEMCACHED_SASL_PWDB\"\necho \"zulip@localhost:$(cat $MEMCACHED_PASSWORD_FILE)\" >> \"$MEMCACHED_SASL_PWDB\"\nexec memcached -S\n"]
