import { NotFoundError } from '@shared/errors/NotFoundError';
import { getExtractedText } from './chat.repository';
import { askGemini } from '@infrastructure/ai/chat';
import { AskQuestionInput } from './chat.types';

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
