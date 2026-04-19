-- Versioning table (useful for DB migrations)
CREATE TABLE IF NOT EXISTS schema_migrations (
    id SERIAL PRIMARY KEY,
    filename TEXT UNIQUE NOT NULL,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    home_address VARCHAR(255),
    diagnosis VARCHAR(255)
);

-- Person table
CREATE TABLE IF NOT EXISTS persons (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    age INTEGER,
    relationship VARCHAR(100)
);

-- Conversation table
CREATE TABLE IF NOT EXISTS conversations (
    id SERIAL PRIMARY KEY,
    person_id INTEGER NOT NULL,
    summary TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_conversations_person
        FOREIGN KEY (person_id)
        REFERENCES persons(id)
        ON DELETE CASCADE
);

-- Embeddings table
CREATE TABLE IF NOT EXISTS embeddings (
    id SERIAL PRIMARY KEY,
    person_id INTEGER NOT NULL,
    embedding TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_embeddings_person
        FOREIGN KEY (person_id)
        REFERENCES persons(id)
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_conversations_person_id
    ON conversations(person_id);

CREATE INDEX IF NOT EXISTS idx_embeddings_person_id
    ON embeddings(person_id);
