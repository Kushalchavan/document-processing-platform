import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '@shared/errors/UnauthorizedError';
import { verifyAccessToken } from '@shared/utils/jwt';

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const authorization = req.headers.authorization;
  if (!authorization) {
    throw new UnauthorizedError('Authorization header is missing');
  }

  if (!authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('Invalid authorization header');
  }

  const token = authorization.split(' ')[1];

  try {
    const payload = verifyAccessToken(token);
    req.user = payload;

    next();
  } catch {
    throw new UnauthorizedError('Invalid or expired access token');
  }
}
