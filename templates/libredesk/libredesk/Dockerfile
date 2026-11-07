FROM libredesk/libredesk:latest
COPY config.toml /libredesk/config.toml
CMD ["sh","-c","./libredesk --install --idempotent-install --yes --config /libredesk/config.toml && ./libredesk --upgrade --yes --config /libredesk/config.toml && ./libredesk --config /libredesk/config.toml"]
