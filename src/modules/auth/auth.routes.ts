import { Router } from 'express';
import {
  loginController,
  logoutController,
  registerController,
  refreshController,
} from './auth.controller';
import { registerSchema, loginSchema, refreshSchema } from './auth.schema';
import { validate } from '@shared/middleware/validate.middleware';
import { authenticate } from '@shared/middleware/auth.middleware';

const router = Router();

router.post('/register', validate(registerSchema), registerController);
router.post('/login', validate(loginSchema), loginController);
router.post('/logout', authenticate, logoutController);
router.post('/refresh', validate(refreshSchema), refreshController);

export default router;
