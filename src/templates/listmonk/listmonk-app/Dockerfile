FROM listmonk/listmonk:v5.0.0
COPY config.toml /listmonk/config.toml
CMD ["sh","-c","./listmonk --install --idempotent --yes --config '' && ./listmonk --upgrade --yes --config '' && ./listmonk --config ''"]
