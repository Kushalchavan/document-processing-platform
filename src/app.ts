import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { json, urlencoded } from 'express';
import { requestIdMiddleware } from '@shared/middleware/requestId.middleware.js';
import { errorHandler } from '@shared/errors/errorHandler.js';
import { healthRouter } from '@shared/routes/health.routes.js';
import authRouter from './modules/auth/auth.routes';
import { httpLogger } from '@infrastructure/logger/httpLogger';

const app = express();

app.use(httpLogger);
app.use(requestIdMiddleware);
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));

app.use('/health', healthRouter);

//module routes registration goes here
app.use('/api/v1/auth', authRouter);

// Error handling middleware
app.use(errorHandler);

export default app;
