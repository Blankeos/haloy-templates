FROM flowiseai/flowise-worker:latest
ENTRYPOINT ["sh","-c","/bin/sh -c \"node /app/healthcheck/healthcheck.js & sleep 5 && pnpm run start-worker\""]
