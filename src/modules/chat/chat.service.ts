import { generateEmbedding } from '../../infrastructure/ai/embedding.js';
import { askGemini } from '../../infrastructure/ai/chat.js';
import { NotFoundError } from '../../shared/errors/NotFoundError.js';
import { searchRelevantChunks } from './chat.repository.js';
import { AskQuestionInput } from './chat.types.js';

export async function askQuestion({
  documentId,
  question,
}: AskQuestionInput) {
  // Generate embedding for the user's question
  const embedding = await generateEmbedding(question);

  // Search the most relevant chunks
  const chunks = await searchRelevantChunks(documentId, embedding);

  if (chunks.length === 0) {
    throw new NotFoundError('No relevant content found');
  }

  // Build the context
  const context = chunks
    .map((chunk) => chunk.content)
    .join('\n\n');

  // Asking Gemini using only the relevant context
  const answer = await askGemini(context, question);

  return {
    answer,
  };
}