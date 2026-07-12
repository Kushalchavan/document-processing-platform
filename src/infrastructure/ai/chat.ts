import { gemini } from './gemini';

export async function askGemini(context: string, question: string) {
  const response = await gemini.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `
You are an AI assistant.

Answer the user's question ONLY using the provided document.

If the answer is not present, reply:
"I couldn't find that information in the document."

Document:
${context}

Question:
${question}
    `,
  });

  return response.text ?? '';
}
