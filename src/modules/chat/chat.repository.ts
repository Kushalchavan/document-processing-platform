import { dbPool } from '../../infrastructure/database/pool.js';

export async function getExtractedText(documentId: number) {
  const result = await dbPool.query(
    `
      SELECT extracted_text
      FROM documents
      WHERE id = $1
    `,
    [documentId],
  );

  return result.rows[0] ?? null;
}
