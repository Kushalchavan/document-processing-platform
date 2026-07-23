import { Worker } from 'bullmq';
import { redis } from '../../infrastructure/queue/redis.js';
import {
  findDocumentByIdForWorker,
  updateDocumentStatus,
  updateExtractedText,
} from '../../modules/documents/document.repository.js';
import { createChunk, updateEmbedding } from '../../modules/documents/chunk.repository.js';
import { extractTextFromPdf } from '../../shared/utils/pdf.js';
import { chunkText } from '../../shared/utils/chunk.js';
import { generateEmbedding } from '../../infrastructure/ai/embedding.js';
import { logger } from '../../infrastructure/logger/logger.js';

export async function processDocument(documentId: number) {
  logger.info('Received job');

  await updateDocumentStatus(documentId, 'processing');

  const document = await findDocumentByIdForWorker(documentId);
  if (!document) {
    throw new Error('Document not found');
  }

  const text = await extractTextFromPdf(document.file_path);

  await updateExtractedText(documentId, text);

  const chunks = chunkText(text);

  for (const [index, chunk] of chunks.entries()) {
    await createChunk(documentId, index, chunk);

    const embedding = await generateEmbedding(chunk);

    await updateEmbedding(documentId, index, embedding);
  }

  await updateDocumentStatus(documentId, 'completed');
}

export const documentWorker = new Worker(
  'document-processing',
  async (job) => {
    try {
      await processDocument(job.data.documentId);
    } catch (error) {
      logger.error({ err: error }, 'Worker crashed');
      throw error;
    }
  },
  {
    connection: redis,
  },
);
