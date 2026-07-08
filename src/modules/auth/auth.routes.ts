import { Router } from 'express';
import { registerController } from './auth.controller';
import { registerSchema } from './auth.schema';
import { validate } from '@shared/middleware/validate.middleware';

const router = Router();

router.post('/register', validate(registerSchema), registerController);

export default router;
