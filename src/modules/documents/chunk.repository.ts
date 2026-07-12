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

export async function updateEmbedding(documentId: number, chunkIndex: number, embedding: number[]) {
  await dbPool.query(
    `
      UPDATE document_chunks
      SET embedding = $1::vector
      WHERE document_id = $2
      AND chunk_index = $3
    `,
    [`[${embedding.join(',')}]`, documentId, chunkIndex],
  );
}
