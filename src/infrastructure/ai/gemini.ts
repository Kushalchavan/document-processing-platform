import { GoogleGenAI } from '@google/genai';
import { env } from '@config/env';

export const gemini = new GoogleGenAI({
  apiKey: env.geminiApiKey,
});
