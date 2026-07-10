import fs from 'node:fs/promises';
import {
  createDocument,
  getDocument,
  findDocumentById,
  deleteDocument,
} from './document.repository';
import { UploadDocumentInput } from './document.types';
import { NotFoundError } from '@shared/errors/NotFoundError';
import { documentQueue } from '@infrastructure/queue/document.queue';

export async function uploadDocument({ userId, file }: UploadDocumentInput) {
  const document = await createDocument({
    userId,
    fileName: file.originalname,
    filePath: file.path,
    fileSize: file.size,
    mimeType: file.mimetype,
  });

  await documentQueue.add('process-document', {
    documentId: document.id,
  });

  return document;
}

export async function getDocuments(userId: number, page: number, limit: number) {
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

export async function getDocumentById(documentId: number, userId: number) {
  const document = await findDocumentById(documentId, userId);

  if (!document) {
    throw new NotFoundError('Document not found');
  }

  return document;
}

export async function deleteDocuments(documentId: number, userId: number) {
  const document = await findDocumentById(documentId, userId);

  if (!document) {
    throw new NotFoundError('Document not found');
  }

  // Delet file if it exists
  try {
    await fs.unlink(document.file_path);
  } catch (error: any) {
    // Ignore if file is already missing
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }

  await deleteDocument(documentId);
}
