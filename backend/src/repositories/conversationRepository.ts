import pool from "../libs/db";

export async function saveConversation(personId: number, summary: string) {
    await pool.query(
        `INSERT INTO conversations (person_id, summary)
         VALUES ($1, $2)`,
        [personId, summary]
    );
}