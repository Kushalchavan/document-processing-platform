import { Router } from 'express';
import {
  loginController,
  logoutController,
  registerController,
  refreshController,
} from './auth.controller.js';
import { registerSchema, loginSchema } from './auth.schema.js';
import { validate } from '../../shared/middleware/validate.middleware.js';
import { authenticate } from '../../shared/middleware/auth.middleware.js';

const router = Router();

router.post('/register', validate(registerSchema), registerController);
router.post('/login', validate(loginSchema), loginController);
router.post('/logout', authenticate, logoutController);
router.post('/refresh', refreshController);

export default router;
