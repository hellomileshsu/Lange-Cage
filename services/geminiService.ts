import { GoogleGenAI, Type } from "@google/genai";
import { NPC, ChatMessage, VocabularyItem, Item } from "../types";
import { MENU_ITEMS } from "../constants";

const getAiClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    roleplayResponse: {
      type: Type.STRING,
      description: "In-character response. Natural English, under 40 words.",
    },
    educationalFeedback: {
      type: Type.STRING,
      description: "Grammar/vocab feedback in Traditional Chinese.",
    },
    fluencyScore: {
      type: Type.INTEGER,
      description: "0-10 score for user input.",
    },
    currentEmotion: {
      type: Type.STRING,
      description: "The NPC's current emotion: 'happy', 'sad', 'angry', 'surprised', 'neutral', or 'thinking'.",
    },
    missionCompleted: {
      type: Type.BOOLEAN,
      description: "True if user met the mission condition (e.g. they served a drink correctly).",
    },
    orderedItemName: {
      type: Type.STRING,
      description: `If ordering, pick ONE from: ${MENU_ITEMS.map(i => i.name).join(', ')}.`
    },
    rewardItem: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        icon: { type: Type.STRING, description: "A single emoji." },
        description: { type: Type.STRING }
      },
      description: "Optional: An item the NPC gives to the player (e.g. Ben gives a drink)."
    },
    detectedVocabulary: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          word: { type: Type.STRING },
          definition: { type: Type.STRING },
          partOfSpeech: { type: Type.STRING },
          example: { type: Type.STRING }
        },
        required: ["word", "definition", "partOfSpeech", "example"],
      },
      description: "List of 1-2 useful vocabulary words."
    }
  },
  required: ["roleplayResponse", "educationalFeedback", "fluencyScore", "currentEmotion", "missionCompleted", "detectedVocabulary"],
};

export const generateGreeting = async (npc: NPC): Promise<{ text: string, emotion: string }> => {
  const ai = getAiClient();
  const isBarista = npc.id === 'barista';
  const isWaiting = !!npc.pendingOrder;
  const isDrinking = !!npc.beverage;
  
  const systemInstruction = `
    You are ${npc.name}, a ${npc.role} at "Cozy Cafe".
    ${isBarista ? "You are the Head Barista. You give the Owner drinks if they ask for one of the menu items." : ""}
    ${!isBarista && !isWaiting && !isDrinking ? "You are a customer ready to order from the menu: " + MENU_ITEMS.map(i => i.name).join(', ') : ""}
    ${!isBarista && isWaiting ? `You are waiting for your ${npc.pendingOrder}. You are a bit impatient.` : ""}
    
    Keep greeting under 20 words. Provide emotion.
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Start conversation.",
      config: { 
        systemInstruction, 
        temperature: 1.0,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING },
            emotion: { type: Type.STRING }
          },
          required: ["text", "emotion"]
        }
      },
    });
    const data = JSON.parse(response.text || "{}");
    return { text: data.text || npc.initialMessage || "Hello!", emotion: data.emotion || "neutral" };
  } catch (e) {
    return { text: npc.initialMessage || "Hello!", emotion: "neutral" };
  }
};

export const generateNPCResponse = async (
  npc: NPC,
  history: ChatMessage[],
  userMessage: string,
  itemGiven?: Item
): Promise<{ 
  text: string; 
  feedback: string; 
  score: number; 
  emotion: string;
  isMissionComplete: boolean; 
  vocabulary: VocabularyItem[];
  rewardItem?: Item;
  orderedItemName?: string;
}> => {
  
  const ai = getAiClient();
  const isBarista = npc.id === 'barista';
  const isWaiting = !!npc.pendingOrder;
  const isDrinking = !!npc.beverage;

  const systemInstruction = `
    You are ${npc.name}, a ${npc.role} at "Cozy Cafe".
    
    MENU: ${MENU_ITEMS.map(i => i.name).join(', ')}.
    
    ROLES:
    - IF Barista (Ben): If user asks for an item from the menu, give it to them using 'rewardItem'.
    - IF Customer: 
        - If no order yet, pick one from the MENU and set 'orderedItemName'.
        - If 'itemGiven' is ${npc.pendingOrder}, set 'missionCompleted' to true, react happily.
        - If 'itemGiven' is NOT ${npc.pendingOrder} and you were waiting, react with disappointment and explain what you actually wanted.
    
    Context: ${history.map((msg) => `${msg.role === 'user' ? 'Owner' : npc.role}: ${msg.text}`).join('\n')}
    ${itemGiven ? `The owner just gave you a ${itemGiven.name} (${itemGiven.icon}).` : ""}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userMessage,
      config: {
        systemInstruction,
        temperature: 0.8,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const json = JSON.parse(response.text || "{}");
    return {
      text: json.roleplayResponse || "...",
      feedback: json.educationalFeedback || "",
      score: json.fluencyScore || 0,
      emotion: json.currentEmotion || "neutral",
      isMissionComplete: json.missionCompleted || false,
      vocabulary: json.detectedVocabulary || [],
      rewardItem: json.rewardItem,
      orderedItemName: json.orderedItemName
    };
  } catch (error) {
    return { text: "...", feedback: "", score: 0, emotion: "neutral", isMissionComplete: false, vocabulary: [] };
  }
};

export const updateNPCMemory = async (npc: NPC, history: ChatMessage[]): Promise<string> => {
  const ai = getAiClient();
  const historyText = history.map(m => `${m.role}: ${m.text}`).join('\n');
  const systemInstruction = `Update memory for ${npc.name}. Context: ${historyText}`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Summarize memory.",
      config: { systemInstruction, temperature: 0.3 },
    });
    return response.text?.trim() || npc.memory || "";
  } catch (e) {
    return npc.memory || "";
  }
};

/**
 * Generates an image based on a prompt using the Gemini 3 Pro image model.
 * Users must select their own API key via window.aistudio.openSelectKey() before this can be used.
 */
export const generateImage = async (prompt: string, size: '1K' | '2K' | '4K' = '1K'): Promise<string> => {
  // Create a new instance right before making an API call to ensure it uses the most up-to-date user API key.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: {
      parts: [
        {
          text: prompt,
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1",
        imageSize: size
      }
    },
  });

  if (response.candidates?.[0]?.content?.parts) {
    // Search through response parts to find the generated image data
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64EncodeString: string = part.inlineData.data;
        return `data:image/png;base64,${base64EncodeString}`;
      }
    }
  }
  
  throw new Error("Failed to generate image: No image data returned from model.");
};
