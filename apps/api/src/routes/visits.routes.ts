import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { optionalAuth } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { pageViewSchema } from '../schemas/visits.schema.js';
import { recordPageView } from '../controllers/visits.controller.js';

// A whole class behind one school IP clicking through lessons stays under it,
// and the table still can't be flooded: rows are small and go every night.
const pageViewLimiter = rateLimit({
  windowMs: 60_000,
  /* v8 ignore next -- NODE_ENV ternary evaluated at module load; only the 'test' branch runs in tests. */
  limit: process.env.NODE_ENV === 'test' ? 10_000 : 300,
});

const router = Router();

router.post('/', pageViewLimiter, optionalAuth, validateBody(pageViewSchema), recordPageView);

export default router;
