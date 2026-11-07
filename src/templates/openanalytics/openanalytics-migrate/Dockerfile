FROM ${OA_IMAGE_REPO:-ghcr.io/openlabs-so/openanalytics}/migrate:${OA_IMAGE_TAG:-v0.5.0}
ENTRYPOINT ["sh","-c","node packages/postgres/dist/cli.js && node packages/clickhouse/dist/cli.js"]
