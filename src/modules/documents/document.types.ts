export interface CreateDocumentInput {
  userId: number;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
}

export interface GetDocumentsInput {
  userId: number;
  page: number;
  limit: number;
}