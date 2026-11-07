-- Separate database for PowerSync bucket storage.
CREATE DATABASE powersync_storage OWNER powersync;

-- Demo table synced by the default sync rules.
CREATE TABLE lists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO lists (name) VALUES ('Welcome to PowerSync');

-- Publication used by PowerSync logical replication.
CREATE PUBLICATION powersync FOR ALL TABLES;
