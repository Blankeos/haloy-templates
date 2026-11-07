FROM inngest/inngest:v1.12.1
CMD ["sh","-c","exec inngest start --host 0.0.0.0 --port 8288 --event-key \"${EVENT_KEY}\" --signing-key \"${SIGNING_KEY}\" --postgres-uri \"postgresql://inngest:${POSTGRES_PASSWORD}@inngest-postgres:5432/inngest?sslmode=disable\" --redis-uri redis://inngest-redis:6379 --poll-interval 60 --queue-workers 100"]
