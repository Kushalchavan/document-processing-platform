import { dbPool } from '../../infrastructure/database/pool.js';

export async function searchRelevantChunks(
  documentId: number,
  embedding: number[],
  limit = 5,
) {
  const result = await dbPool.query(
    `
    SELECT
      content,
      chunk_index,
      embedding <=> $2::vector AS distance
    FROM document_chunks
    WHERE document_id = $1
    ORDER BY embedding <=> $2::vector
    LIMIT $3;
    `,
    [documentId, JSON.stringify(embedding), limit],
  );

  return result.rows;
}