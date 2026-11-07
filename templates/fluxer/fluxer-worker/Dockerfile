FROM ${FLUXER_REGISTRY:-ghcr.io/fluxerapp}/fluxer-api:${FLUXER_IMAGE_TAG:-v1}
EXPOSE 8080
CMD ["./node_modules/.bin/tsx","src/WorkerEntrypoint.ts"]
