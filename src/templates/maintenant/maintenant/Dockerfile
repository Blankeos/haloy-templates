FROM nginxinc/nginx-unprivileged:1.29-alpine
ENTRYPOINT ["/bin/sh","-c","printf '%s:{PLAIN}%s\\n' \"$AUTH_USER\" \"$AUTH_PASSWORD\" > /tmp/htpasswd && exec nginx -g 'daemon off;'"]
