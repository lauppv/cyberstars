import { Router } from 'express';
import { limiter } from '../middleware/rateLimit.js';
import { optionalAuth } from '../middleware/auth.js';
import { getWebLessonStart } from '../controllers/lessons.controller.js';

// One read per web lesson opened (and per language switch): a few files and at
// most one database lookup. Guests open lessons too, so it goes by IP.
const startLimiter = limiter({
  windowMs: 60_000,
  limit: 120,
});

const router = Router();

// What a web lesson starts from (CYB-119): a guest gets the course's version
router.get('/:courseKey/:lessonSlug/start', startLimiter, optionalAuth, getWebLessonStart);

export default router;
