import { z } from 'zod';

export const askQuestionSchema = z.object({
  documentId: z.number().int().positive(),
  question: z.string().min(1),
});
