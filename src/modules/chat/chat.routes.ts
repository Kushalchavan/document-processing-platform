import { Router } from 'express';
import { authenticate } from '../../shared/middleware/auth.middleware.js';
import { askQuestionController } from './chat.controller.js';

const router = Router();

router.post('/ask', authenticate, askQuestionController);

export default router;
