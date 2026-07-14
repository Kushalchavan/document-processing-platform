import { dbPool } from '../../infrastructure/database/pool.js';
import { CreateDocumentInput, GetDocumentsInput } from './document.types.js';

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
export async function getDocument({ userId, page, limit }: GetDocumentsInput) {
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

// find a document by it's id for a specific user
export async function findDocumentById(documentId: number, userId: number) {
  const result = await dbPool.query(
    `
      SELECT *
      FROM documents
      WHERE id = $1
      AND user_id = $2
    `,
    [documentId, userId],
  );

  return result.rows[0] || null;
}

// finding docuement by id for worker /
export async function findDocumentByIdForWorker(documentId: number) {
  const result = await dbPool.query(
    `
      SELECT *
      FROM documents
      WHERE id = $1
    `,
    [documentId],
  );

  return result.rows[0] || null;
}

// Delete docuemnt
export async function deleteDocument(documentId: number) {
  await dbPool.query(
    `
      DELETE FROM documents
      WHERE id = $1
    `,
    [documentId],
  );
}

// updating document status
export async function updateDocumentStatus(documentId: number, status: string) {
  await dbPool.query(
    `
      UPDATE documents
      SET status = $1
      WHERE id = $2
    `,
    [status, documentId],
  );
}

// update extracted text
export async function updateExtractedText(documentId: number, extractedText: string) {
  await dbPool.query(
    `
      UPDATE documents
      SET extracted_text = $1
      WHERE id = $2
    `,
    [extractedText, documentId],
  );
}
