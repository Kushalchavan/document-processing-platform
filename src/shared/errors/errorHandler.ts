import { NextFunction, Request, Response } from 'express';
import { AppError } from './AppError';

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      error: {
        message: error.message,
        status: error.statusCode,
      },
    });
  }

  console.error(error);

  return res.status(500).json({
    error: {
      message: 'Internal Server Error',
      status: 500,
    },
  });
}