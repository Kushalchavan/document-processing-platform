import { Request, Response } from 'express';
import { askQuestionSchema } from './chat.schema';
import { askQuestion } from './chat.service';

export async function askQuestionController(req: Request, res: Response) {
  const body = askQuestionSchema.parse(req.body);

  const result = await askQuestion(body);

  return res.status(200).json(result);
}
