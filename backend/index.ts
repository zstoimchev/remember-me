import "dotenv/config";
// Using Groq via OpenAI-compatible SDK — free tier, generous limits
import express, { Request, Response } from "express";
import cors from "cors";
import OpenAI from "openai";
import pool from "./src/db";

const app = express();

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from TypeScript Express 🚀");
});

app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.post("/summarize", async (req: Request, res: Response) => {
  const { text } = req.body;

  if (!text || typeof text !== "string" || text.trim() === "") {
    res
      .status(400)
      .json({ error: "Missing or empty 'text' field in request body." });
    return;
  }

  try {
    console.log("the text that will be sent to the AI is:", text);
    const prompt = `Summarize the following text in 2 sentences maximum, no fluff just information. Here is the text that needs summarizing: "${text}"`;

    console.log("The prompt is:", prompt);
    const completion = await openai.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const summary = completion.choices[0]?.message?.content ?? "";
    console.log("The summary is: ", summary);
    res.json({ summary });
  } catch (error) {
    console.error("Groq summarization error:", error);
    res.status(500).json({ error: "Failed to summarize the provided text." });
  }
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
