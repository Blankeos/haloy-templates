FROM eqalpha/keydb:latest
CMD ["sh","-c","exec keydb-server /etc/keydb/keydb.conf --server-threads 2 --requirepass \"${KEYDB_PASSWORD}\""]
