FROM swaggerapi/swagger-ui:v5.32.14@sha256:3d93169968848d371a6a56ca1ab18b47a8906ba461b8eba0688866354f5431d5
CMD ["/bin/sh","-ec","base64 -d /tmp/openapi.json.gz.b64 | gzip -dc > /usr/share/nginx/html/openapi.json; exec /docker-entrypoint.sh nginx -g 'daemon off;'"]
