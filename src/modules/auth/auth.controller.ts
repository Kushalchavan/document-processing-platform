import { Request, Response } from 'express';
import { login, logout, refresh, register } from './auth.service.js';
import { env } from '../../config/env.js';

export async function registerController(req: Request, res: Response) {
  const { username, email, password } = req.body;

  const newUser = await register({ username, email, password });
  return res.status(201).json(newUser);
}

export async function loginController(req: Request, res: Response) {
  const result = await login(req.body);

  // set the refresh token http-only cookie
  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: env.nodeEnv === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({
    user: result.user,
    accessToken: result.accessToken,
  });
}

export async function logoutController(req: Request, res: Response) {
  res.clearCookie('refreshToken');

  await logout(req.user.userId);

  return res.json({
    message: 'Logged out successfully',
  });
}

export async function refreshController(req: Request, res: Response) {
  const refreshToken = req.cookies.refreshToken;

  const result = await refresh({ refreshToken });

  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: env.nodeEnv === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.json({
    accessToken: result.accessToken,
  });
}
