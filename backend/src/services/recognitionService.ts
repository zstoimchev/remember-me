import { getEmbedding } from "./mlService";
import {
  getAllEmbeddings,
  createUnknownPerson,
  saveEmbedding,
  getPersonDetails,
} from "../repositories/personRepository";
import { cosineSimilarity } from "../utils/similarity";

const SIMILARITY_THRESHOLD = 0.6;

function findBestMatch(
    incoming: number[],
    rows: any[]
): number | null {
  let bestMatch: { personId: number; similarity: number } | null = null;

  for (const row of rows) {
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

export async function recognizePerson(imageBuffer: Buffer) {
  const embedding = await getEmbedding(imageBuffer);

  if (!embedding) {
    return { known: false };
  }

  const embeddings = await getAllEmbeddings();
  const personId = findBestMatch(embedding, embeddings);

  if (!personId) {
    const newId = await createUnknownPerson();
    await saveEmbedding(newId, embedding);

    return { known: false };
  }

  const person = await getPersonDetails(personId);

  console.log("Finished recognized person", person);

  if (!person) {
    return { known: false };
  }

  return {
    known: true,
    name: person.name,
    relationship: person.relationship,
    age: person.age,
    lastConversation: person.last_conversation ?? null,
  };
}