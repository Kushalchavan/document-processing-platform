import {createDocument} from './document.repository';

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