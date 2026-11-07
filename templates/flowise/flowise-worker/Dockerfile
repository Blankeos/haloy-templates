FROM flowiseai/flowise-worker:latest
EXPOSE 8080
ENTRYPOINT ["/bin/sh","-c","node /app/healthcheck/healthcheck.js & sleep 5 && pnpm run start-worker"]
