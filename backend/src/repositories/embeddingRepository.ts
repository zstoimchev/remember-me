import pool from "../libs/db";

export async function getAllEmbeddings() {
    const result = await pool.query(
        `SELECT person_id, embedding
         FROM embeddings`
    );
    return result.rows;
}

export async function saveEmbedding(personId: number, embedding: number[]) {
    await pool.query(
        `INSERT INTO embeddings (person_id, embedding)
         VALUES ($1, $2)`,
        [personId, JSON.stringify(embedding)]
    );
}