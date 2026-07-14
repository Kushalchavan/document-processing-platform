import app from './app.js';
import { env } from './config/env.js';
import { logger } from './infrastructure/logger/logger.js';
import './infrastructure/workers/document.worker.js';

const server = app.listen(env.port, () => {
  logger.info(`Server is running on port ${env.port}`);
});

const shutdown = async (signal: string) => {
  logger.info(`Received ${signal}, shutting down gracefully`);

  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
