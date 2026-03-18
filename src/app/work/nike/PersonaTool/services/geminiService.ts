import { GoogleGenAI } from "@google/genai";
import { Persona } from '../types';

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generatePersonaResponse = async (
  persona: Persona,
  history: { role: 'user' | 'model'; content: string }[],
  userMessage: string
): Promise<string> => {
  try {
    if (!ai) return "The Gemini API key is missing. Please configure it to interact with the personas.";
    const modelId = 'gemini-3-flash-preview';

    // @ts-ignore - handling specific versions of AI library
    const model = ai.getGenerativeModel({ model: modelId });

    const chatHistory = history.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({
      history: chatHistory,
      generationConfig: {
        temperature: 0.7,
      },
    });

    // Handle system instruction if needed - some versions use it in getGenerativeModel
    // For now, let's assume valid model object

    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    return response.text() || "I have nothing to add at this moment.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I apologize, but I'm having trouble processing that request right now.";
  }
};

export const generateFocusGroupResponse = async (
  activePersonas: Persona[],
  history: { role: 'user' | 'model'; content: string }[],
  userMessage: string
): Promise<string> => {
  try {
    if (!ai) return "The Gemini API key is missing. Please configure it to interact with the focus group.";
    const modelId = 'gemini-3-flash-preview';

    const participantsDescription = activePersonas.map(p =>
      `Name: ${p.name.toUpperCase()} (${p.role})\nBio/Personality: ${p.systemInstruction}`
    ).join('\n---\n');

    const groupSystemInstruction = `
      You are simulating a consumer focus group with the following participants:
      ${participantsDescription}

      The user acts as the Moderator.

      DIRECTIVES FOR RESPONSE:
      1. **MANDATORY PARTICIPATION**: EVERY participant listed above MUST provide an individual response to the moderator's question in this turn.
      2. **NO GROUP SUMMARIES**: Write out the exact dialogue for each person separately.
      3. **INTERACTION**: Participants should speak to the moderator but also react to each other.
      4. **STRICT SCRIPT FORMAT**: Output strictly as a screenplay script. Name followed by colon.
         
      Format:
      NAME: [Dialogue]
    `;

    // @ts-ignore
    const model = ai.getGenerativeModel({
      model: modelId,
      systemInstruction: groupSystemInstruction
    });

    const chatHistory = history.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({
      history: chatHistory,
      generationConfig: {
        temperature: 0.9,
      },
    });

    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    return response.text() || "The group remains silent.";
  } catch (error) {
    console.error("Gemini Group API Error:", error);
    return "The focus group is having technical difficulties.";
  }
};