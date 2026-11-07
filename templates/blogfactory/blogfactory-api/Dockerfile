FROM ghcr.io/blogfactoryhq/blogfactory-api:v0.1.0
CMD ["sh","-c","bun run src/init-s3-bucket.ts && bun run src/db/migrate.ts && exec bun run src/index.ts"]
