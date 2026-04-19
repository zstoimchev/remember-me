import pool from "../libs/db";

export async function getAllEmbeddings() {
    const result = await pool.query(
        `SELECT person_id, embedding FROM embeddings`
    );
    return result.rows;
}

export async function createUnknownPerson(): Promise<number> {
    const result = await pool.query(
        `INSERT INTO persons (name) VALUES ('Unknown') RETURNING id`
    );
    return result.rows[0].id;
}

export async function saveEmbedding(personId: number, embedding: number[]) {
    await pool.query(
        `INSERT INTO embeddings (person_id, embedding) VALUES ($1, $2)`,
        [personId, JSON.stringify(embedding)]
    );
}

export async function getPersonDetails(personId: number) {
    const result = await pool.query(
        `SELECT p.name, p.age, p.relationship,
            (SELECT summary FROM conversations
             WHERE person_id = p.id
             ORDER BY created_at DESC
             LIMIT 1) AS last_conversation,
            (SELECT diagnosis FROM users LIMIT 1) AS diagnosis
     FROM persons p
     WHERE p.id = $1`,
        [personId]
    );

    return result.rows[0] ?? null;
}