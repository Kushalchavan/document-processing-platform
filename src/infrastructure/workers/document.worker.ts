import { Worker } from 'bullmq';
import { redis } from '../queue/redis';

export const documentWorker = new Worker(
  'document-processing',
  async (job) => {
    console.log('Processing document:', job.data.documentId);

    // Processing logic here
  },
  {
    connection: redis,
  },
);

documentWorker.on('ready', () => {
  console.log('✅ Document Worker Ready');
});