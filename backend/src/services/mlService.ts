import axios from "axios";
import FormData from "form-data";

const ML_URL = process.env.ML_SERVICE_URL || "http://127.0.0.1:8001";

export async function getEmbedding(imageBuffer: Buffer): Promise<number[] | null> {
  const form = new FormData();
  form.append("file", imageBuffer, {
    filename: "frame.jpg",
    contentType: "image/jpeg",
  });

  const response = await axios.post(`${ML_URL}/recognize`, form, {
    headers: form.getHeaders(),
  });

  const data = response.data?.data;

  if (!data?.faceDetected) return null;

  return data.embedding as number[];
}