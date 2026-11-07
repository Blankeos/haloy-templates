FROM posthog/posthog:${POSTHOG_VERSION}
EXPOSE 8080
CMD ["./bin/docker-worker-celery","--with-scheduler"]
