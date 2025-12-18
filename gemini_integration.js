import { GoogleGenerativeAI } from "@google/generative-ai";

// TODO: Replace with your actual Gemini API key
const API_KEY = "YOUR_API_KEY_HERE";

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * Fetches a dialogue response from the Gemini API for a game character.
 *
 * @param {string} characterName - The name of the NPC.
 * @param {string} personality - The personality description of the NPC.
 * @param {string} playerInput - The text input from the player.
 * @returns {Promise<string>} The generated dialogue response.
 */
export async function getCharacterDialogue(characterName, personality, playerInput) {
  const prompt = `
    You are an NPC in a cozy cafe RPG designed for English learners.
    Character Name: ${characterName}
    Personality: ${personality}
    
    Current situation: The player has approached you in the cafe.
    Player says: "${playerInput}"
    
    Respond as ${characterName}. Keep the response concise, friendly, and suitable for an English learner.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm sorry, I didn't quite catch that.";
  }
}