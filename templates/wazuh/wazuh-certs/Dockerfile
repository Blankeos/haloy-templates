FROM wazuh/wazuh-certs-generator:0.0.4
COPY certs.yml /config/certs.yml
EXPOSE 8080
ENTRYPOINT ["/bin/bash","-c"]
CMD ["set -e\nif [ ! -f /certificates/wazuh.indexer.pem ]; then\n  bash /entrypoint.sh\nfi\n# entrypoint.sh exits 0 even when the cert tool fails\ntest -f /certificates/wazuh.indexer.pem\n# The generator leaves the directory root-only (500); the indexer and\n# dashboard run as uid 1000 and must be able to traverse it.\nchmod 755 /certificates\n"]
