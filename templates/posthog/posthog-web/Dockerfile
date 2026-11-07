FROM posthog/posthog:${POSTHOG_VERSION}
EXPOSE 8080
CMD ["sh","-c","./bin/migrate && exec ./bin/docker-server"]
