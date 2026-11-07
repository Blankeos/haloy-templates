#!/bin/bash
set -e

# Create additional databases (ignore error if they already exist)
psql -v ON_ERROR_STOP=0 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE DATABASE fnidentity;
    CREATE DATABASE routr;
EOSQL

# Grant privileges
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    GRANT ALL PRIVILEGES ON DATABASE fnidentity TO $POSTGRES_USER;
    GRANT ALL PRIVILEGES ON DATABASE routr TO $POSTGRES_USER;
EOSQL
