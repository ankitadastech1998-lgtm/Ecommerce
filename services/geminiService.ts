
import { GoogleGenAI, Type } from "@google/genai";

export const getAIProductRecommendations = async (query: string, availableProducts: any[]) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `User is searching for: "${query}". Based on these available products: ${JSON.stringify(availableProducts.map(p => ({id: p.id, name: p.name, desc: p.description})))}. Recommend the most relevant product IDs in order of priority. Respond ONLY with a JSON array of strings.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    const text = response.text || "[]";
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini AI Search Error:", error);
    return [];
  }
};

export const getAddressFromCoords = async (lat: number, lng: number) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Given coordinates lat: ${lat}, lng: ${lng}, generate a plausible realistic physical address for a home in a major city. Include street name, city, state, and zip code. Respond ONLY with a JSON object.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            street: { type: Type.STRING },
            city: { type: Type.STRING },
            state: { type: Type.STRING },
            zipCode: { type: Type.STRING },
            country: { type: Type.STRING }
          },
          required: ["street", "city", "state", "zipCode", "country"]
        }
      }
    });

    const text = response.text || "{}";
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini AI Reverse Geocode Error:", error);
    return null;
  }
};
