import { v4 as uuid } from 'uuid';
import { Request, Response, NextFunction } from 'express';

export const requestIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
  req.id = uuid();
  res.setHeader('x-request-id', req.id);
  next();
};
