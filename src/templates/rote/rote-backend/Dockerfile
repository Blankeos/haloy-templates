FROM rabithua/rote-backend:${IMAGE_TAG:-latest}
CMD ["sh","-c","sleep 15 && bun run dist/scripts/runMigrations.js && bun run dist/server.js"]
