import { Request, Response } from 'express';
import { uploadDocument, getDocuments, getDocumentById, deleteDocuments } from './document.service';
import { getDocumentsSchema, documentParamsSchema } from './document.schema';

export async function uploadDocumentController(req: Request, res: Response) {
  if (!req.file) {
    throw new Error('No file uploaded');
  }

  const document = await uploadDocument({
    userId: req.user.userId,
    file: req.file,
  });

  return res.status(201).json(document);
}

export async function getDocumentsController(req: Request, res: Response) {
  // const page = Number(req.query.page) || 1; // default page
  // const limit = Number(req.query.limit) || 10; // default limit

  // validate and parse query params using zod
  const { page, limit } = getDocumentsSchema.parse(req.query);

  const result = await getDocuments(req.user.userId, page, limit);

  return res.status(200).json(result);
}

export async function getDocumentByIdController(req: Request, res: Response) {
  const { id } = documentParamsSchema.parse(req.params);

  const document = await getDocumentById(id, req.user.userId);

  return res.status(200).json(document);
}

export async function deleteDocumentController(req: Request, res: Response) {
  const { id } = documentParamsSchema.parse(req.params);

  await deleteDocuments(id, req.user.userId);

  return res.sendStatus(204);
}
