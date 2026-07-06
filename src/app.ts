import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import pinoHttp from 'pino-http';
import { json, urlencoded } from 'express';
import { requestIdMiddleware } from '@shared/middleware/requestId.middleware.js';
import { errorHandler } from '@shared/errors/errorHandler.js';
import { healthRouter } from '@shared/routes/health.routes.js';

const app = express();

app.use(pinoHttp());
app.use(requestIdMiddleware);
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(json());
app.use(urlencoded({ extended: true }));

app.use('/health', healthRouter);

// future module routes registration goes here

app.use(errorHandler);

export default app;
