import pool from "../libs/db";

export async function createUnknownPerson(): Promise<number> {
    const result = await pool.query(
        `INSERT INTO persons (name)
         VALUES ('Unknown name') RETURNING id`
    );
    return result.rows[0].id;
}

export async function getPersonDetails(personId: number) {
    const result = await pool.query(
        `SELECT p.name,
                p.age,
                p.relationship,
                (SELECT summary
                 FROM conversations
                 WHERE person_id = p.id
                 ORDER BY created_at DESC
                    LIMIT 1 ) AS last_conversation
         FROM persons p
         WHERE p.id = $1`,
        [personId]
    );

    return result.rows[0] ?? null;
}

export async function updatePersonName(personId: number, name: string) {
    await pool.query(
        `UPDATE persons
         SET name = $2
         WHERE id = $1`,
        [personId, name]
    );
}