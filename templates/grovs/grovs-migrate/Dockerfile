FROM ghcr.io/grovs-io/backend:2.3.1
EXPOSE 8080
CMD ["bash","-c","bin/rails db:prepare && bin/rails db:seed && bin/rails clickhouse:setup"]
