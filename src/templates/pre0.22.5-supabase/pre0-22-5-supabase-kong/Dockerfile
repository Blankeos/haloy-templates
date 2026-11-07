FROM kong:2.8.1
ENTRYPOINT ["sh","-c","bash -c 'eval \"echo \\\"$(cat ~/temp.yml)\\\"\" > ~/kong.yml && /docker-entrypoint.sh kong docker-start'"]
