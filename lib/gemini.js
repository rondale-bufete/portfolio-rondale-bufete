import { GoogleGenAI } from "@google/genai";

let client;
function getClient() {
    if (!client) {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error("GEMINI_API_KEY is not set.");
        }
        client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
    return client;
}

const MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash";

// History entries contain a user or assistant role and message content.
export async function askGemini({ systemInstruction, history }) {
    const ai = getClient();

    const contents = history.map((m) => ({
        // Map Gemini's "model" role to "assistant" for the rest of the app.
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
        model: MODEL,
        contents,
        config: {
            systemInstruction,
            temperature: 0.4,
        },
    });

    const text = response.text;
    if (!text) {
        throw new Error("Empty response from Gemini.");
    }
    return text.trim();
}
