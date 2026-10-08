import { Router } from 'express';
import passport from 'passport';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';
import * as authController from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/authenticate.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { registerSchema, loginSchema } from '../validators/auth.schema.js';
import { logActivity } from '../middleware/logActivity.js';

const router = Router();

const ensureGoogleEnabled = (req, res, next) => {
    if (!env.google.enabled) return next(new ApiError(503, 'Google login is not configured'));
    next();
};

router.get('/google', ensureGoogleEnabled, passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

router.get('/google/callback', ensureGoogleEnabled, passport.authenticate('google', {
    session: false,
    failureRedirect: `${env.clientUrl}/login?error=google`,
}),
    logActivity('LOGIN', 'User'),
    authController.googleCallback
);

router.post('/register', authLimiter, validate(registerSchema), logActivity('REGISTER', 'User'), authController.register);
router.post('/login', authLimiter, validate(loginSchema), logActivity('LOGIN', 'User'), authController.login);
router.post('/refresh', authLimiter, authController.refresh);
router.post('/logout', logActivity('LOGOUT', 'User'), authController.logout);
router.get('/me', authenticate, authController.me);

export default router;