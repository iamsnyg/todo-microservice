#!/bin/bash
set -e

echo "Creating application databases and users..."

psql -v ON_ERROR_STOP=1 \
    --username "$POSTGRES_USER" \
    --dbname "$POSTGRES_DB" \
    --set=auth_password="$AUTH_DB_PASSWORD" \
    --set=notification_password="$NOTIFICATION_DB_PASSWORD" <<'EOSQL'

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_catalog.pg_roles
        WHERE rolname = 'auth_user'
    ) THEN
        CREATE ROLE auth_user LOGIN PASSWORD :'auth_password';
    ELSE
        ALTER ROLE auth_user WITH PASSWORD :'auth_password';
    END IF;
END
$$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_catalog.pg_roles
        WHERE rolname = 'notification_user'
    ) THEN
        CREATE ROLE notification_user LOGIN PASSWORD :'notification_password';
    ELSE
        ALTER ROLE notification_user WITH PASSWORD :'notification_password';
    END IF;
END
$$;

SELECT 'CREATE DATABASE auth_db OWNER auth_user'
WHERE NOT EXISTS (
    SELECT FROM pg_database WHERE datname = 'auth_db'
)\gexec

SELECT 'CREATE DATABASE notification_db OWNER notification_user'
WHERE NOT EXISTS (
    SELECT FROM pg_database WHERE datname = 'notification_db'
)\gexec

EOSQL

echo "Application databases and users are ready."