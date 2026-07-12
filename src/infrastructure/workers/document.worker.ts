import { Worker } from 'bullmq';
import { redis } from '@infrastructure/queue/redis';
import {
  findDocumentByIdForWorker,
  updateDocumentStatus,
  updateExtractedText,
} from '@modules/documents/document.repository';
import { extractTextFromPdf } from '@shared/utils/pdf';
import { createChunk } from '@modules/documents/chunk.repository';
import { chunkText } from '@shared/utils/chunk';
import { generateEmbedding } from '@infrastructure/ai/embedding';
import { logger } from '@infrastructure/logger/logger';

export const documentWorker = new Worker(
  'document-processing',
  async (job) => {
    try {
      logger.info('Received job:', job.data);

      const { documentId } = job.data;
      logger.info('Updating status...');
      await updateDocumentStatus(documentId, 'processing');

      logger.info('Finding document...');
      const document = await findDocumentByIdForWorker(documentId);

      if (!document) {
        throw new Error('Document not found');
      }

      logger.info('Extracting PDF...');
      const text = await extractTextFromPdf(document.file_path);

      logger.info('Updating extracted text...');
      await updateExtractedText(documentId, text);

      logger.info('Chunking...');
      const chunks = chunkText(text);

      logger.info(`Chunks: ${chunks.length}`);

      for (const [index, chunk] of chunks.entries()) {
        logger.info(`Processing chunk ${index}`);
        await createChunk(documentId, index, chunk);
        const embedding = await generateEmbedding(chunk);
        logger.info(`Embedding length: ${embedding.length}`);
      }

      await updateDocumentStatus(documentId, 'completed');
      logger.info('Worker finished');
    } catch (error: any) {
      logger.error('Worker crashed:', error);
      throw error;
    }
  },
  {
    connection: redis,
  },
);
