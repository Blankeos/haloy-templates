FROM matrixdotorg/synapse:v1.156.0
COPY homeserver.yaml /config/homeserver.yaml
COPY log.config /config/log.config
ENTRYPOINT ["/bin/sh","-c","python -m synapse.app.homeserver --config-path /config/homeserver.yaml --keys-directory /data --generate-keys\nchown -R 991:991 /data\nexec /start.py\n"]
