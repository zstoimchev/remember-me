#!/bin/bash

set -e

DB_HOST="localhost"
DB_PORT="5432"
DB_NAME="remember_me"
DB_USER="remember_me_user"

MIGRATIONS_DIR="./data/migrations"

echo "Running migrations..."

for file in $(ls $MIGRATIONS_DIR | sort); do
    echo "Checking $file..."

    APPLIED=$(psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -tAc \
        "SELECT 1 FROM schema_migrations WHERE filename = '$file'")

    if [ "$APPLIED" = "1" ]; then
        echo "Skipping $file (already applied)"
    else
        echo "Applying $file..."

        psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f "$MIGRATIONS_DIR/$file"

        psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c \
            "INSERT INTO schema_migrations (filename) VALUES ('$file');"

        echo "Applied $file"
    fi
done

echo "Migrations complete."
