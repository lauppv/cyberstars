import { Router, type Request } from 'express';
import rateLimit from 'express-rate-limit';
import { authenticateToken, requireFeatureAccess } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { hintSchema } from '../schemas/hints.schema.js';
import { execRateLimitHandler } from './terminal.routes.js';
import { getHint } from '../controllers/hints.controller.js';

// Each hint is one Gemini call against a shared free-tier quota, so cap tightly
// per user. The 3-level progression already bounds hints per lesson.
const hintLimiter = rateLimit({
  windowMs: 60_000,
  /* v8 ignore next -- NODE_ENV ternary evaluated at module load; only the 'test' branch runs in tests. */
  limit: process.env.NODE_ENV === 'test' ? 10_000 : 15,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => req.user?.id ?? 'unknown',
  handler: execRateLimitHandler,
});

const router = Router();

router.post(
  '/:courseKey/:lessonSlug',
  authenticateToken,
  requireFeatureAccess('aiHints'),
  hintLimiter,
  validateBody(hintSchema),
  getHint,
);

export default router;
