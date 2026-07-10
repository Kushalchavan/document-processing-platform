import { Worker } from "bullmq";
import { redis } from "@infrastructure/queue/redis";
import { updateDocumentStatus } from "@modules/documents/document.repository";

export const documentWorker = new Worker(
  "document-processing",
  async (job) => {
    const { documentId } = job.data;

    await updateDocumentStatus(documentId, "processing");

    console.log(`Processing document ${documentId}`);

    // Fake AI processing
    await new Promise((resolve) => setTimeout(resolve, 5000));

    await updateDocumentStatus(documentId, "completed");

    console.log(`Completed document ${documentId}`);
  },
  {
    connection: redis,
  },
);