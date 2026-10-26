import { Router, type Request } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { limiter } from '../middleware/rateLimit.js';
import { validateBody } from '@cyberstars-framework/server-kit/validate';
import { answerQuizSchema, startQuizSchema } from '../schemas/laniakea.schema.js';
import { answerQuiz, getState, markSeen, startQuiz } from '../controllers/laniakea.controller.js';

// Plain DB reads and writes, one per answer, so a loose cap per student;
// authenticateToken runs first, so req.user is always set here.
const laniakeaLimiter = limiter({
  windowMs: 60_000,
  limit: 120,
  keyGenerator: (req: Request) => String(req.user!.id),
});

const router = Router();

router.use(authenticateToken, laniakeaLimiter);
router.get('/', getState);
router.post('/seen', markSeen);
router.post('/:slug/quiz', validateBody(startQuizSchema), startQuiz);
router.post('/:slug/quiz/answer', validateBody(answerQuizSchema), answerQuiz);

export default router;
