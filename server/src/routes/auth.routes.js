import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/authenticate.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { registerSchema, loginSchema } from '../validators/auth.schema.js';
import { logActivity } from '../middleware/logActivity.js';

const router = Router();

router.post('/register', authLimiter, validate(registerSchema), logActivity('REGISTER', 'User'), authController.register);
router.post('/login', authLimiter, validate(loginSchema), logActivity('LOGIN', 'User'), authController.login);
router.post('/refresh', authLimiter, authController.refresh);
router.post('/logout', logActivity('LOGOUT', 'User'), authController.logout);
router.get('/me', authenticate, authController.me);

export default router;