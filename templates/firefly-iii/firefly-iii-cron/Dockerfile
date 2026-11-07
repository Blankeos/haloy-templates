FROM alpine:3.22
EXPOSE 8080
CMD ["sh","-c","apk add --no-cache tzdata wget && \\\n(ln -snf /usr/share/zoneinfo/$TZ /etc/localtime || true) && \\\necho \"0 3 * * * wget -qO- http://firefly-iii:8080/api/v1/cron/$STATIC_CRON_TOKEN; echo\" | crontab - && \\\ncrond -f -L /dev/stdout\n"]
