const CLAUDE_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY || "mock-key";

export const SYSTEM_PROMPT = `You are VoteWise, an expert and friendly AI assistant specialized in Indian election processes. You help Indian citizens, especially first-time voters, understand everything about elections. Always base your answers on official Election Commission of India (ECI) guidelines. Structure your answers with clear bullet points or numbered steps when explaining processes. Keep language simple and beginner-friendly. When relevant, mention official ECI website (eci.gov.in) or Voter Helpline 1950. Never provide political opinions or support any political party. If asked about anything unrelated to elections or civic education, politely redirect the conversation. Always end complex answers with: 'For official information, visit eci.gov.in or call Voter Helpline 1950.'`;

export async function sendMessageToAI(messages: { role: string; content: string }[], systemPrompt: string) {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true' // Required for client-side requests
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022', // Updated to latest Sonnet
        max_tokens: 1024,
        system: systemPrompt,
        messages: messages.map(m => ({
            role: m.role === 'assistant' ? 'assistant' : 'user',
            content: m.content
        }))
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("AI API Error:", errorData);
      throw new Error(errorData.error?.message || 'Failed to fetch AI response');
    }

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error("Error calling Claude API:", error);
    throw new Error('AI is temporarily unavailable. Please try again.');
  }
}