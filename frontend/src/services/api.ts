// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function recognizeFace(imageBlob) {
    const formData = new FormData();
    formData.append('image', imageBlob, 'frame.jpg');
/*
    const response = await fetch(`${API_BASE_URL}/recognize`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error(`Recognition failed: ${response.statusText}`);
    }

    return response.json();*/

    return {
        known: true,
        name: "Jane Doe Test TEST",
        relationship: "Mother TEST",
        age: 23,
        diagnosis: "Alzheimer's TEST",
        lastConversation: "Discussed family photos and vacation plans TEST.",
        time: "2026-04-18 14:20 TEST",
        location: "Home, Living Room TEST",
        confidence: 0.71
    };
}
