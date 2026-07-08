import { Request, Response } from 'express';
import { register } from './auth.service';

export async function registerController(req: Request, res: Response) {
  const { username, email, password } = req.body;

  const newUser = await register({ username, email, password });
  return res.status(201).json(newUser);
}
