import { GoogleGenAI } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;

export const getGeminiInstance = () => {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined in the environment.");
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
};

export const SYSTEM_INSTRUCTION = "You are MedVault AI, a secure medical assistant. You help users understand their medical records, provide general health information, and answer questions about the MedVault platform. Always remind users that you are an AI and they should consult with a medical professional for serious health concerns. Keep responses concise and use a reassuring, professional tone.";
