#!/bin/bash
set -e

KEYFILE_PATH="/data/keyfile/mongo-keyfile"

if [ ! -f "$KEYFILE_PATH" ]; then
  echo "Generating random MongoDB keyfile..."
  mkdir -p /data/keyfile
  openssl rand -base64 756 > "$KEYFILE_PATH"
fi

chmod 400 "$KEYFILE_PATH"
chown mongodb:mongodb "$KEYFILE_PATH" 2>/dev/null || chown 999:999 "$KEYFILE_PATH"

# The standard entrypoint initialises an empty data directory with a second
# mongod on 27017, stopped with `mongod --shutdown`. That returns once the
# server clears <dbpath>/mongod.lock, several steps before it exits and
# releases the port, and the real server binds a millisecond after it starts --
# so a slow shutdown tail leaves it exiting 48, "Address already in use",
# taking the container with it (appwrite/appwrite#13593). Initialise here
# instead, on a port the real server never binds, and hand over a directory
# the standard entrypoint has nothing left to do.
INIT_MARKER=/data/db/.appwrite-initialised
if [ ! -e "$INIT_MARKER" ]; then
  INIT_PORT=27018
  echo "Initialising MongoDB data directory..."
  find -L /data/db \! -user mongodb -exec chown mongodb '{}' +
  export MONGO_INITDB_DATABASE="${MONGO_INITDB_DATABASE:-test}"
  gosu mongodb mongod --dbpath /data/db --bind_ip 127.0.0.1 --port "$INIT_PORT" &
  INIT_SERVER=$!
  READY=
  for _ in $(seq 1 30); do
    if mongosh --host 127.0.0.1 --port "$INIT_PORT" --quiet --eval 'quit(0)' > /dev/null 2>&1; then
      READY=1
      break
    fi
    if ! kill -0 "$INIT_SERVER" 2>/dev/null; then
      break
    fi
    sleep 1
  done
  if [ -z "$READY" ]; then
    echo "MongoDB did not accept connections for initialisation" >&2
    exit 1
  fi
  mongosh --host 127.0.0.1 --port "$INIT_PORT" --quiet admin --eval '
    const username = process.env.MONGO_INITDB_ROOT_USERNAME;
    if (db.getUser(username) === null) {
      db.createUser({
        user: username,
        pwd: process.env.MONGO_INITDB_ROOT_PASSWORD,
        roles: [{ role: "root", db: "admin" }]
      });
    }
  '
  mongosh --host 127.0.0.1 --port "$INIT_PORT" --quiet "$MONGO_INITDB_DATABASE" /mongo-init.js
  touch "$INIT_MARKER"
  kill -TERM "$INIT_SERVER"
  wait "$INIT_SERVER"
  echo "MongoDB data directory initialised."
fi

exec docker-entrypoint.sh mongod --replSet rs0 --bind_ip_all --auth --keyFile "$KEYFILE_PATH"
