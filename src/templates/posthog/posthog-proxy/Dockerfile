FROM caddy:2.10-alpine
ENTRYPOINT ["sh","-c","sh"]
CMD ["sh","-c","-c 'printf \"%s\" \"$CADDYFILE\" > /etc/caddy/Caddyfile && exec caddy run -c /etc/caddy/Caddyfile'"]
