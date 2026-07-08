import { Router } from 'express';
import { loginController, registerController } from './auth.controller';
import { registerSchema, loginSchema } from './auth.schema';
import { validate } from '@shared/middleware/validate.middleware';

const router = Router();

router.post('/register', validate(registerSchema), registerController);
router.post('/login', validate(loginSchema), loginController);

export default router;
