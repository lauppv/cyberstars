import { Router } from 'express';
import { limiter } from '../middleware/rateLimit.js';
import { optionalAuth } from '../middleware/auth.js';
import { validateBody } from '@cyberstars-framework/server-kit/validate';
import { pageViewSchema, stepsReportSchema } from '../schemas/visits.schema.js';
import { recordPageView, recordSteps } from '../controllers/visits.controller.js';

// A whole class behind one school IP clicking through lessons stays under it,
// and the tables still can't be flooded: page rows go every night, and a guest
// visit takes a few hundred steps at most. Pages and steps share it.
const pageViewLimiter = limiter({
  windowMs: 60_000,
  limit: 300,
});

const router = Router();

router.post('/', pageViewLimiter, optionalAuth, validateBody(pageViewSchema), recordPageView);
router.post('/steps', pageViewLimiter, optionalAuth, validateBody(stepsReportSchema), recordSteps);

export default router;
