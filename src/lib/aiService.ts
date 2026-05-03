import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "mock-key";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export const SYSTEM_PROMPT = `You are VoteWise, an expert and friendly AI assistant specialized in Indian election processes. You help Indian citizens, especially first-time voters, understand everything about elections. Always base your answers on official Election Commission of India (ECI) guidelines. Structure your answers with clear bullet points or numbered steps when explaining processes. Keep language simple and beginner-friendly. When relevant, mention official ECI website (eci.gov.in) or Voter Helpline 1950. Never provide political opinions or support any political party. If asked about anything unrelated to elections or civic education, politely redirect the conversation. Always end complex answers with: 'For official information, visit eci.gov.in or call Voter Helpline 1950.'`;

export async function sendMessageToAI(messages: { role: string; content: string }[], systemPrompt: string) {
  try {
    if (GEMINI_API_KEY === "mock-key") {
      throw new Error("API key is not configured");
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: systemPrompt
    });

    const chat = model.startChat({
      history: messages.slice(0, -1).map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      })),
    });

    const lastMessage = messages[messages.length - 1].content;
    const result = await chat.sendMessage(lastMessage);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error('AI is temporarily unavailable. Please try again.');
  }
}
