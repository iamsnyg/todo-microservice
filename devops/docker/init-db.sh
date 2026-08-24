#!/bin/bash
set -e

echo "Creating application databases and users..."

psql -v ON_ERROR_STOP=1 \
    --username "$POSTGRES_USER" \
    --dbname "$POSTGRES_DB" \
    --set=auth_password="$AUTH_DB_PASSWORD" \
    --set=notification_password="$NOTIFICATION_DB_PASSWORD" <<'EOSQL'

SELECT 'CREATE ROLE auth_user LOGIN PASSWORD ' ||
       quote_literal(:'auth_password')
WHERE NOT EXISTS (
    SELECT FROM pg_catalog.pg_roles
    WHERE rolname = 'auth_user'
)\gexec

ALTER ROLE auth_user WITH PASSWORD :'auth_password';

SELECT 'CREATE ROLE notification_user LOGIN PASSWORD ' ||
       quote_literal(:'notification_password')
WHERE NOT EXISTS (
    SELECT FROM pg_catalog.pg_roles
    WHERE rolname = 'notification_user'
)\gexec

ALTER ROLE notification_user WITH PASSWORD :'notification_password';

SELECT 'CREATE DATABASE auth_db OWNER auth_user'
WHERE NOT EXISTS (
    SELECT FROM pg_database
    WHERE datname = 'auth_db'
)\gexec

SELECT 'CREATE DATABASE notification_db OWNER notification_user'
WHERE NOT EXISTS (
    SELECT FROM pg_database
    WHERE datname = 'notification_db'
)\gexec

EOSQL

echo "Application databases and users are ready."
