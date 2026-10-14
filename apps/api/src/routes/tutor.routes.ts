import { Router, type Request } from 'express';
import rateLimit from 'express-rate-limit';
import { authenticateToken, requireFeatureAccess } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { tutorChatSchema } from '../schemas/tutor.schema.js';
import { execRateLimitHandler } from './terminal.routes.js';
import { chat } from '../controllers/tutor.controller.js';

// A message can cost up to four Gemini calls (three tool rounds and the answer)
// against a shared quota, so cap it per user.
const tutorLimiter = rateLimit({
  windowMs: 60_000,
  /* v8 ignore next -- NODE_ENV ternary evaluated at module load; only the 'test' branch runs in tests. */
  limit: process.env.NODE_ENV === 'test' ? 10_000 : 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => String(req.user!.id),
  handler: execRateLimitHandler,
});

const router = Router();

router.post(
  '/chat',
  authenticateToken,
  requireFeatureAccess('tutorChat'),
  tutorLimiter,
  validateBody(tutorChatSchema),
  chat,
);

export default router;
