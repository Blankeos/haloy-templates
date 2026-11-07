FROM wazuh/wazuh-indexer:4.14.8
EXPOSE 8080
ENTRYPOINT ["/bin/bash","-c"]
CMD ["set -e\nSEC=/usr/share/wazuh-indexer/config/opensearch-security\n[ -f \"$SEC/.dokploy-users\" ] && exit 0\nexport JAVA_HOME=/usr/share/wazuh-indexer/jdk\nHASH=/usr/share/wazuh-indexer/plugins/opensearch-security/tools/hash.sh\nADMIN_HASH=$(bash $HASH -p \"$INDEXER_PASSWORD\" | tail -1)\nKIBANA_HASH=$(bash $HASH -p \"$DASHBOARD_PASSWORD\" | tail -1)\ncat > \"$SEC/internal_users.yml\" <<EOF\n---\n_meta:\n  type: \"internalusers\"\n  config_version: 2\nadmin:\n  hash: \"$ADMIN_HASH\"\n  reserved: true\n  backend_roles:\n  - \"admin\"\n  description: \"Admin user\"\nkibanaserver:\n  hash: \"$KIBANA_HASH\"\n  reserved: true\n  description: \"Wazuh dashboard server user\"\nEOF\ntouch \"$SEC/.dokploy-users\"\n"]
