FROM stpaquet/alpinemailcatcher:latest@sha256:499c0eabca5e82b23d030706ba9d5b8b27bba5a5f34a43154ee5e68b07cba52c
CMD ["sh","-c","mailcatcher --foreground --smtp-port=1025 --http-port=1080 --ip=0.0.0.0 --messages-limit=$MAIL_LIMIT --persistence --no-quit"]
