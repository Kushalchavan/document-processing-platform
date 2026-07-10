import { dbPool } from '@infrastructure/database/pool';

export async function createChunk(documentId: number, chunkIndex: number, content: string) {
  await dbPool.query(
    `
    INSERT INTO document_chunks
    (
      document_id,
      chunk_index,
      content
    )
    VALUES ($1,$2,$3)
    `,
    [documentId, chunkIndex, content],
  );
}
