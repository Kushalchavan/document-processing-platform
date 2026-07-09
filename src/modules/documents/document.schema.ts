import { z } from 'zod';

// schema for query params for getting docs
export const getDocumentsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type GetDocumentsInput = z.infer<typeof getDocumentsSchema>;

// schema for document params
export const documentParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export type DocumentParams = z.infer<typeof documentParamsSchema>;
