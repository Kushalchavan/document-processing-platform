import { Request, Response } from 'express';
import { login, register } from './auth.service';

export async function registerController(req: Request, res: Response) {
  const { username, email, password } = req.body;

  const newUser = await register({ username, email, password });
  return res.status(201).json(newUser);
}

export async function loginController(req: Request, res: Response) {
  const result = await login(req.body);

  return res.status(200).json(result);
}
