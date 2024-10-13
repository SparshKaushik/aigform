import { createOpenAI } from "@ai-sdk/openai";
import { env } from "~/env";

const ai = createOpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: env.GROQ_API_KEY,
});

export const gemma2 = ai("gemma2-9b-it");
