CREATE TABLE IF NOT EXISTS persons (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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
