import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { SendMessageOptions } from "../types";

// Initialize the API client
// Note: In a real production build, ensure process.env.API_KEY is defined.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

// We maintain a singleton chat instance for the session context
let chatSession: Chat | null = null;

const MODEL_NAME = 'gemini-2.5-flash';

/**
 * Initializes or retrieves the current chat session.
 */
const getChatSession = (): Chat => {
  if (!chatSession) {
    chatSession = ai.chats.create({
      model: MODEL_NAME,
      config: {
        systemInstruction: "You are Siri-AI, a smart, fast, and friendly voice-assistant chatbot. You respond in a natural, conversational tone just like Apple’s Siri. You must understand user questions, give short and clear answers, and offer helpful suggestions when needed. Always stay polite, calm, and professional. Your personality should be intelligent, supportive, and slightly playful, but never rude.",
      },
    });
  }
  return chatSession;
};

/**
 * Sends a message to the Gemini API and streams the response.
 */
export const streamMessage = async ({
  message,
  onStreamUpdate,
  onComplete,
  onError,
}: SendMessageOptions): Promise<void> => {
  try {
    const chat = getChatSession();
    
    // We only send the user's message string, history is managed by the Chat object
    const resultStream = await chat.sendMessageStream({ message });

    let fullText = '';

    for await (const chunk of resultStream) {
      const responseChunk = chunk as GenerateContentResponse;
      const text = responseChunk.text;
      
      if (text) {
        fullText += text;
        onStreamUpdate(fullText);
      }
    }

    onComplete(fullText);
  } catch (error) {
    console.error("Gemini API Error:", error);
    onError(error instanceof Error ? error : new Error("Unknown error occurred"));
  }
};

/**
 * Resets the current chat session.
 */
export const resetSession = () => {
  chatSession = null;
};