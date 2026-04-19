import openai from "../libs/openai";

export async function summarizeText(text: string): Promise<string> {
  const prompt = `Summarize the following text in 2 sentences maximum, no fluff just information. Important, don't say text, say conversation. Here is the text that needs summarizing: "${text}"`;

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
  return summary;
}
