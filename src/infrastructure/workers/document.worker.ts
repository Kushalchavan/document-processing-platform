import { Worker } from 'bullmq';
import { redis } from '@infrastructure/queue/redis';
import {
  findDocumentByIdForWorker,
  updateDocumentStatus,
  updateExtractedText,
} from '@modules/documents/document.repository';
import { extractTextFromPdf } from '@shared/utils/pdf';

export const documentWorker = new Worker(
  'document-processing',
  async (job) => {
    const { documentId } = job.data;

    await updateDocumentStatus(documentId, 'processing');

    const document = await findDocumentByIdForWorker(documentId);

    if (!document) {
      throw new Error('Document not found');
    }

    const text = await extractTextFromPdf(document.file_path);

    await updateExtractedText(documentId, text);
    await updateDocumentStatus(documentId, 'completed');

    console.log(`Completed document ${documentId}`);
  },
  {
    connection: redis,
  },
);
