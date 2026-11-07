FROM alpine:3.20
CMD ["sh","-c","/bin/sh -c \"\n  apk add --no-cache curl &&\n  echo '0 3 * * * /usr/bin/curl -s -X POST http://domain-locker-app:3000/api/domain-updater' > /etc/crontabs/root &&\n  echo '0 4 * * * /usr/bin/curl -s -X POST http://domain-locker-app:3000/api/expiration-reminders' >> /etc/crontabs/root &&\n  crond -f -L /dev/stdout\n\"\n"]
