FROM mongo:8.2.5
COPY mongo-init.js /mongo-init.js
COPY mongo-entrypoint.sh /mongo-entrypoint.sh
ENTRYPOINT ["/bin/bash","/mongo-entrypoint.sh"]
