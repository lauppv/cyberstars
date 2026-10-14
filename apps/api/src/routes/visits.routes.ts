import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { optionalAuth } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { pageViewSchema, stepsReportSchema } from '../schemas/visits.schema.js';
import { recordPageView, recordSteps } from '../controllers/visits.controller.js';

// A whole class behind one school IP clicking through lessons stays under it,
// and the tables still can't be flooded: page rows go every night, and a guest
// visit takes a few hundred steps at most. Pages and steps share it.
const pageViewLimiter = rateLimit({
  windowMs: 60_000,
  /* v8 ignore next -- NODE_ENV ternary evaluated at module load; only the 'test' branch runs in tests. */
  limit: process.env.NODE_ENV === 'test' ? 10_000 : 300,
});

const router = Router();

router.post('/', pageViewLimiter, optionalAuth, validateBody(pageViewSchema), recordPageView);
router.post('/steps', pageViewLimiter, optionalAuth, validateBody(stepsReportSchema), recordSteps);

export default router;
