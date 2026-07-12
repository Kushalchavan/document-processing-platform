import { NextFunction, Request, Response } from 'express';
import { AppError } from './AppError';
import { MulterError } from 'multer';
import { logger } from '@infrastructure/logger/logger';

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      error: {
        message: error.message,
        status: error.statusCode,
      },
    });
  }

  // handle multer error
  if (error instanceof MulterError) {
    let message = error.message;

    if (error.code === 'LIMIT_FILE_SIZE') {
      message = 'File size must not exceed 10 MB';
    }

    return res.status(400).json({
      error: {
        message,
        status: 400,
      },
    });
  }

  logger.error(error);

  return res.status(500).json({
    error: {
      message: 'Internal Server Error',
      status: 500,
    },
  });
}
