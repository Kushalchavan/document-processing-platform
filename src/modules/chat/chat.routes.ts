import { Router } from 'express';
import { authenticate } from '@shared/middleware/auth.middleware';
import { askQuestionController } from './chat.controller';

const router = Router();

router.post('/ask', authenticate, askQuestionController);

export default router;
