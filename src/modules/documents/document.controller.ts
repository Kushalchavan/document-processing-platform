import { Request, Response } from 'express';
import { uploadDocument } from './document.service';

export async function uploadDocumentController(req: Request,res: Response,) {
  if (!req.file) {
    throw new Error('No file uploaded');
  }

  const document = await uploadDocument({
    userId: req.user.userId,
    file: req.file,
  });

  return res.status(201).json(document);
}