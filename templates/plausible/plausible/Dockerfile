FROM ghcr.io/plausible/community-edition:v3.2.1
CMD ["sh","-c","sleep 10 && /entrypoint.sh db createdb && /entrypoint.sh db migrate && /entrypoint.sh run"]
