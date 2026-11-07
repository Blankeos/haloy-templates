FROM docker.io/mongo:latest
CMD ["bash","-c","\n  echo \"${MONGO_KEY}\" > /etc/mongo-keyfile &&\n  chown 999:999 /etc/mongo-keyfile &&\n  chmod 400 /etc/mongo-keyfile &&\n  exec docker-entrypoint.sh mongod --replSet rs --bind_ip_all --port 27017 --keyFile /etc/mongo-keyfile\n"]
