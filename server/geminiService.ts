import { GoogleGenAI } from '@google/genai';

let aiInstance: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  if (aiInstance) return aiInstance;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return null;
  }
  try {
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
    return aiInstance;
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
    return null;
  }
}

export async function generateGeminiCompletion(
  prompt: string,
  systemInstruction?: string
): Promise<string | null> {
  const ai = getAiClient();
  if (!ai) {
    return null;
  }

  try {
    const timeoutPromise = new Promise<null>((resolve) => 
      setTimeout(() => resolve(null), 5000)
    );

    const completionPromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction || 
          'You are the Universal Document Intelligence AI Assistant. Analyze any organizational, technical, financial, administrative, geological, or operational document with strict factual accuracy. Never fabricate numbers, dates, organizations, or citations. Always cite exact document title, page number, and table. If evidence is insufficient, state clearly: "I could not find sufficient evidence in the available documents."'
      }
    }).then(res => res.text?.trim() || null).catch(err => {
      console.warn('Gemini generateContent error:', err?.message || err);
      return null;
    });

    return await Promise.race([completionPromise, timeoutPromise]);
  } catch (error) {
    console.warn('Gemini API call warning (falling back to deterministic synthesis):', error);
    return null;
  }
}
