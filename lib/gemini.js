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

// history: array of { role: "user" | "assistant", content: string }
export async function askGemini({ systemInstruction, history }) {
    const ai = getClient();

    const contents = history.map((m) => ({
        // Gemini's `contents` format uses "model" where a typical chat UI
        // convention uses "assistant" — translate at the boundary so the
        // rest of the app can use the more familiar term.
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
