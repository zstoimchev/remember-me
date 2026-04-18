export async function recognizePerson(imageBuffer: Buffer) {
    console.log('Received image buffer size:', imageBuffer.length);

    return {
        known: true,
        personId: '1',
        name: 'Jane Doe',
        summary: 'Discussed family photos and vacation plans.',
        confidence: 0.92
    };
}