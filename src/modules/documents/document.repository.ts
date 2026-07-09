import { dbPool } from '@infrastructure/database/pool';
import {CreateDocumentInput, GetDocumentsInput} from './document.types';

// create a new document for a specific user
export async function createDocument({
  userId,
  fileName,
  filePath,
  fileSize,
  mimeType,
}: CreateDocumentInput) {
  const result = await dbPool.query(
    `
      INSERT INTO documents (
        user_id,
        file_name,
        file_path,
        file_size,
        mime_type
      )
      VALUES ($1,$2,$3,$4,$5)

      RETURNING
        id,
        file_name,
        file_size,
        mime_type,
        status,
        created_at
    `,
    [userId, fileName, filePath, fileSize, mimeType],
  );

  return result.rows[0];
}

// Get document for a specific user with pagination
export async function getDocument({
  userId,
  page,
  limit,
}: GetDocumentsInput) {
  // calculate the offset for pagination
  const offset = (page - 1) * limit;

  const documents = await dbPool.query(
    `
      SELECT
        id,
        file_name,
        file_size,
        mime_type,
        status,
        created_at
      FROM documents
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2
      OFFSET $3
    `,
    [userId, limit, offset],
  );

  const total = await dbPool.query(
    `
      SELECT COUNT(*)::int AS total
      FROM documents
      WHERE user_id = $1
    `,
    [userId],
  );

  return {
    documents: documents.rows,
    total: total.rows[0].total,
  };
}