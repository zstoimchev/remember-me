export interface RecognizedPerson {
    known: boolean;
    name: string | null;
    relationship: string | null;
    age: number | null;
    diagnosis: string | null;
    lastConversation: string | null;
    location: string | null;
}

import pool from "../libs/db";
import { getEmbedding } from "./mlService";

const SIMILARITY_THRESHOLD = 0.6;

function cosineSimilarity(a: number[], b: number[]): number {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  if (magA === 0 || magB === 0) return 0;
  return dot / (magA * magB);
}

async function findPersonByEmbedding(incoming: number[]): Promise<number | null> {
  // pull all stored embeddings and compare in code (no pgvector)
  const result = await pool.query(
    `SELECT person_id, embedding FROM embeddings`
  );

  let bestMatch: { personId: number; similarity: number } | null = null;

  for (const row of result.rows) {
    const stored: number[] = JSON.parse(row.embedding);
    const similarity = cosineSimilarity(incoming, stored);

    if (similarity > SIMILARITY_THRESHOLD) {
      if (!bestMatch || similarity > bestMatch.similarity) {
        bestMatch = { personId: row.person_id, similarity };
      }
    }
  }

  return bestMatch?.personId ?? null;
}

async function getPersonDetails(personId: number): Promise<RecognizedPerson | null> {
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

  if (!result.rows.length) return null;
  const row = result.rows[0];

  return {
    known: true,
    name: row.name,
    relationship: row.relationship,
    age: row.age,
    diagnosis: row.diagnosis ?? null,
    lastConversation: row.last_conversation ?? null,
    location: null,
  };
}

export async function recognizePerson(imageBuffer: Buffer): Promise<RecognizedPerson> {
  console.log("A. recognizePerson started");
  console.log("B. buffer size:", imageBuffer.length);

  console.log("C. before getEmbedding");
  const embedding = await getEmbedding(imageBuffer);
  console.log("D. after getEmbedding", embedding ? "got embedding" : "no embedding");

  if (!embedding) {
    console.log("E. no embedding returned");
    return {
      known: false,
      name: null,
      relationship: null,
      age: null,
      diagnosis: null,
      lastConversation: null,
      location: null,
    };
  }

  console.log("F. embedding exists");

  // 2. search existing embeddings for a match
  const personId = await findPersonByEmbedding(embedding);

  if (!personId) {
    // 3a. no match — store embedding as new unknown person
    const newPerson = await pool.query(
      `INSERT INTO persons (name) VALUES ('Unknown') RETURNING id`
    );
    const newId = newPerson.rows[0].id;

    await pool.query(
      `INSERT INTO embeddings (person_id, embedding) VALUES ($1, $2)`,
      [newId, JSON.stringify(embedding)]
    );

    return {
      known: false,
      name: null,
      relationship: null,
      age: null,
      diagnosis: null,
      lastConversation: null,
      location: null,
    };
  }

  // 3b. match found — fetch full person details
  const person = await getPersonDetails(personId);

  if (!person) {
    return {
      known: false,
      name: null,
      relationship: null,
      age: null,
      diagnosis: null,
      lastConversation: null,
      location: null,
    };
  }

  return person;
}