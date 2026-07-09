import { dbPool } from '@infrastructure/database/pool';

interface CreateDocumentInput {
  userId: number;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
}

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