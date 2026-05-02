import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const getGeminiChat = () => {
  return ai.chats.create({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction: "You are MedVault AI, a secure medical assistant. You help users understand their medical records, provide general health information, and answer questions about the MedVault platform. Always remind users that you are an AI and they should consult with a medical professional for serious health concerns. Keep responses concise and use a reassuring, professional tone.",
    }
  });
};
