FROM ${ETHORA_API_IMAGE:-docker.io/dappros/ethora-api:2610}
EXPOSE 8080
ENTRYPOINT ["tini","--","bash","/ethora/scripts/api-entrypoint.sh"]
CMD ["jobs"]
