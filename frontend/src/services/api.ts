export async function recognizeFace(imageBlob: Blob) {
    const formData = new FormData();
    formData.append("image", imageBlob, "frame.jpg");

    const response = await fetch("http://localhost:3000/api/recognizePerson", {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        throw new Error(`Recognition failed: ${response.statusText}`);
    }

    return response.json();
}