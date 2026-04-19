# Data — Remember Me

This directory contains everything related to the **PostgreSQL database schema and migrations system**. It is the single source of truth for how the database structure is created and evolved over time.

It is designed to work with a **Dockerized PostgreSQL instance** and a lightweight custom migration script (no external migration tools required).

---

## What it does

The `data` folder is responsible for:

* Initial database schema setup (`schema.sql`)
* Incremental database changes (migrations)
* Tracking which migrations have already been applied
* Ensuring migrations run safely and only once per database

This allows the database to be recreated from scratch or upgraded step-by-step in a predictable way.

---

## Prerequisites

* Docker running
* PostgreSQL container defined in `docker-compose.yml`
* `psql` CLI available locally (used by migration script)

Database must be running before applying migrations:

```bash id="u9h3k1"
docker compose up db -d
```

Default connection is assumed to be:

```id="k2m9qz"
localhost:5432
```

---

## Structure

```id="c8n4fd"
data/
  schema.sql
  migrations/
    190426_init.sql
    200426_add_users.sql
  migrate.sh
```

---

## How it works

### 1. Initial schema (`schema.sql`)

This file contains the **base database structure**.

It is typically used for:

* Initial Docker DB setup
* Creating core tables required by the system
* Creating the migration tracking table

Important table:

```sql id="1v8k3d"
schema_migrations
```

This table stores which migration files have already been executed.

---

### 2. Migrations (`migrations/`)

All future database changes must be added as **new SQL files** inside this folder.

Each migration is:

* Executed exactly once
* Stored in execution order
* Tracked inside `schema_migrations`

---

## Naming convention (VERY IMPORTANT)

Migration files must follow this format:

```id="p0x7aa"
<DDMMYY>_<description>.sql
```

Examples:

```id="q3m9ld"
190426_init.sql
200426_create_users_table.sql
210426_add_embedding_index.sql
```

Rules:

* Use **DDMMYY date prefix** (e.g. `190426` = 19 April 2026)
* Always prefix with the date of creation
* Keep descriptions short and clear
* Never rename already-applied migrations
* Never modify old migration files after they are applied

If a change is needed → create a new migration file with a new date prefix.

---

## Migration execution

All migrations are executed using:

```bash id="v4k1ps"
bash data/migrate.sh
```

What the script does:

1. Reads all files in `data/migrations`
2. Sorts them in order
3. Checks `schema_migrations` table
4. Skips already applied migrations
5. Runs new migrations using `psql`
6. Records successful executions in the DB

---

## Migration tracking table

Each applied migration is stored like this:

| id | filename             | applied_at          |
| -- | -------------------- | ------------------- |
| 1  | 190426_init.sql      | 2026-04-19 10:00:00 |
| 2  | 200426_add_users.sql | 2026-04-19 10:05:00 |

This ensures:

* No migration runs twice
* Order is preserved
* Database state is reproducible

---

## Running migrations

### Step 1 — Start database

```bash id="9xk2m0"
docker compose up db -d
```

### Step 2 — Apply schema + migrations

```bash id="m1c8qv"
bash data/migrate.sh
```

---

## Environment assumptions

The migration script assumes default local credentials:

```id="z8n2wc"
host: localhost
port: 5432
database: your_db
user: your_user
```

You can modify these inside `migrate.sh` if needed.

---

## Safety rules

To keep migrations reliable:

* Never edit already-applied migration files
* Always create a new migration for changes
* Keep migrations idempotent where possible
* Wrap complex migrations in transactions:

```sql id="h3k9ad"
BEGIN;

-- changes here

COMMIT;
```

---

## Summary

This folder provides a **minimal custom migration system** for PostgreSQL that:

* Works with Docker
* Requires no external migration framework
* Tracks applied migrations automatically
* Guarantees consistent database state across environments
* Uses **date-based versioning (DDMMYY)** for natural chronological ordering
