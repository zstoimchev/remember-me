export interface RecognizedPerson {
    known: boolean;
    name: string | null;
    relationship: string | null;
    age: number | null;
    diagnosis: string | null;
    lastConversation: string | null;
    location: string | null;
}

export async function recognizePerson(
    imageBuffer: Buffer
): Promise<RecognizedPerson> {
    console.log("🧠 Processing image...");
    console.log("Buffer size:", imageBuffer.length);

    // 🔥 MOCK LOGIC (for now)
    // simulate delay (like ML processing)
    await new Promise((resolve) => setTimeout(resolve, 500));

    // randomly simulate known / unknown
    const isKnown = Math.random() > 0.3;

    if (!isKnown) {
        return {
            known: false,
            name: "Unknown person, motherfucker!",
            relationship: null,
            age: null,
            diagnosis: null,
            lastConversation: null,
            location: "Unknown",
        };
    }

    // mock known person
    return {
        known: true,
        name: "Jane Doe KNOWN BITCH",
        relationship: "Mother",
        age: 72,
        diagnosis: "Alzheimer's",
        lastConversation: "Discussed family photos and vacation plans.",
        location: "Home, Living Room",
    };
}