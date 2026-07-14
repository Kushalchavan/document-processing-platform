import { NotFoundError } from '../../shared/errors/NotFoundError.js';
import { getExtractedText } from './chat.repository.js';
import { askGemini } from '../../infrastructure/ai/chat.js';
import { AskQuestionInput } from './chat.types.js';

export async function askQuestion({ documentId, question }: AskQuestionInput) {
  const document = await getExtractedText(documentId);

  if (!document) {
    throw new NotFoundError('Document not found');
  }

  if (!document.extracted_text) {
    throw new Error('Document has not been processed yet');
  }

  const answer = await askGemini(document.extracted_text, question);

  return {
    answer,
  };
}
