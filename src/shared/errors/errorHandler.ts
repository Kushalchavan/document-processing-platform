import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err, req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || 500;
  res.status(status).json({
    error: {
      message: err.message || 'Internal Server Error',
      status,
    },
  });
};
