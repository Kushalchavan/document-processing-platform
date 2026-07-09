import {createDocument, getDocument} from './document.repository';

interface UploadDocumentInput {
  userId: number;
  file: Express.Multer.File;
}

export async function uploadDocument({
  userId,
  file,
}: UploadDocumentInput) {
  return createDocument({
    userId,
    fileName: file.originalname,
    filePath: file.path,
    fileSize: file.size,
    mimeType: file.mimetype,
  });
}

export async function getDocuments(
  userId: number,
  page: number,
  limit: number,
) {
  const result = await getDocument({
    userId,
    page,
    limit,
  });

  return {
    documents: result.documents,
    pagination: {
      page,
      limit,
      total: result.total,
      totalPages: Math.ceil(result.total / limit),
    },
  };
}