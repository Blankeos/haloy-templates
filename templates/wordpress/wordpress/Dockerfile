FROM wordpress:latest
COPY uploads.ini /usr/local/etc/php/conf.d/uploads.ini
CMD ["bash","-c","if [ -n \"$WP_DOMAIN\" ]; then\n  (\n    for i in $(seq 1 60); do\n      TRAEFIK_IP=\"$(getent hosts dokploy-traefik | awk '{print $1; exit}')\"\n      if [ -n \"$TRAEFIK_IP\" ]; then\n        grep -q \"[[:space:]]$WP_DOMAIN\\$\" /etc/hosts || echo \"$TRAEFIK_IP $WP_DOMAIN\" >> /etc/hosts\n        break\n      fi\n      sleep 2\n    done\n  ) &\nfi\nexec docker-entrypoint.sh apache2-foreground\n"]
