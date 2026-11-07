// mongo-init.js

const adminDb = db.getSiblingDB('admin');

const username = process.env.MONGO_INITDB_USERNAME;
const password = process.env.MONGO_INITDB_PASSWORD;
const database = process.env.MONGO_INITDB_DATABASE;

// Idempotent: the official entrypoint races the real server on port 27017 when
// initialising a fresh volume (appwrite/appwrite#13593), so this script may run
// more than once. Skip if the user already exists.
if (adminDb.getUser(username) === null) {
  adminDb.createUser({
    user: username,
    pwd: password,
    roles: [
      { role: 'readWrite', db: database }
    ]
  });
}
