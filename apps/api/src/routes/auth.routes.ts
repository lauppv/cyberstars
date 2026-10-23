import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { authenticateToken } from '../middleware/auth.js';
import { validateBody } from '@cyberstars-framework/server-kit/validate';
import {
  loginSchema,
  signupSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../schemas/auth.schema.js';
import * as authController from '../controllers/auth.controller.js';

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  /* v8 ignore next -- NODE_ENV ternary evaluated at module load; only the 'test' branch runs in tests. */
  max: process.env.NODE_ENV === 'test' ? 10_000 : 10,
  message: { error: 'Too many attempts, try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Keyed by the email, not the IP: three reset codes an hour per address from
// all IPs together, counted whether or not an account uses it so the answer
// never tells. Runs after validation, so the email is always there
const resetCodeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  keyGenerator: (req) => req.body.email,
  message: { error: 'Too many codes asked for this email, try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

const router = Router();

router.post('/signup', authLimiter, validateBody(signupSchema), authController.signup);
router.post('/login', authLimiter, validateBody(loginSchema), authController.login);
router.post(
  '/forgot-password',
  authLimiter,
  validateBody(forgotPasswordSchema),
  resetCodeLimiter,
  authController.forgotPassword,
);
router.post(
  '/reset-password',
  authLimiter,
  validateBody(resetPasswordSchema),
  authController.resetPassword,
);
router.post('/logout', authController.logout);
router.get('/me', authenticateToken, authController.me);

export default router;
