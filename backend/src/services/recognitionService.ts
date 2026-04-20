import { getEmbedding } from "./mlService";
import { cosineSimilarity } from "../utils/similarity";
import {
    getAllEmbeddings,
    saveEmbedding,
} from "../repositories/embeddingRepository";
import {
    createUnknownPerson,
    getPersonDetails,
} from "../repositories/personRepository";

const SIMILARITY_THRESHOLD = 0.65;
const UNKNOWN_THRESHOLD = 0.5;
// const COOLDOWN_MS = 3000;

let lastRecognition: { personId: number | null; timestamp: number } | null = null;

function findBestMatch(incoming: number[], rows: any[]) {
    let best: { personId: number; similarity: number } | null = null;

    for (const row of rows) {
        const stored: number[] = JSON.parse(row.embedding);
        const similarity = cosineSimilarity(incoming, stored);

        if (!best || similarity > best.similarity) {
            best = { personId: row.person_id, similarity };
        }
    }

    return best;
}

export async function recognizePerson(imageBuffer: Buffer) {
    const now = Date.now();

    console.log("[recognize] start");

    // if (lastRecognition && now - lastRecognition.timestamp < COOLDOWN_MS) {
    //     console.log("[recognize] cooldown active");
    //     return { known: !!lastRecognition.personId };
    // }

    const embedding = await getEmbedding(imageBuffer);

    console.log("[recognize] embedding received:", {
        hasEmbedding: !!embedding,
        length: embedding?.length ?? 0,
    });

    if (!embedding) {
        console.log("[recognize] no face detected");
        return { known: false };
    }

    const embeddings = await getAllEmbeddings();
    const match = findBestMatch(embedding, embeddings);

    console.log("[recognize] best match:", match);

    if (!match) {
        console.log("[recognize] no match → creating new person");

        const newId = await createUnknownPerson();
        await saveEmbedding(newId, embedding);

        lastRecognition = { personId: null, timestamp: now };

        console.log("[recognize] final response: unknown (new person created)");
        return { known: false };
    }

    if (match.similarity >= SIMILARITY_THRESHOLD) {
        console.log("[recognize] strong match → known person", match.personId);

        const person = await getPersonDetails(match.personId);

        console.log("[recognize] person data:", person);

        lastRecognition = { personId: match.personId, timestamp: now };

        const response = {
            known: true,
            name: person?.name ?? "Unknown",
            relationship: person?.relationship ?? null,
            age: person?.age ?? null,
            diagnosis: person?.diagnosis ?? null,
            lastConversation: person?.last_conversation ?? null,
        };

        console.log("[recognize] final response:", response);
        return response;
    }

    if (match.similarity >= UNKNOWN_THRESHOLD) {
        console.log("[recognize] weak match → updating existing unknown", match.personId);

        await saveEmbedding(match.personId, embedding);

        lastRecognition = { personId: null, timestamp: now };

        console.log("[recognize] final response: unknown (updated)");
        return { known: false };
    }

    console.log("[recognize] low similarity → new unknown person");

    const newId = await createUnknownPerson();
    await saveEmbedding(newId, embedding);

    lastRecognition = { personId: null, timestamp: now };

    console.log("[recognize] final response: unknown (new person)");
    return { known: false };
}