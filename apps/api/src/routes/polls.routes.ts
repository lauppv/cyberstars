import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { validateBody } from '@cyberstars-framework/server-kit/validate';
import { pollVoteSchema } from '../schemas/polls.schema.js';
import * as pollsController from '../controllers/polls.controller.js';

const router = Router();

// Only accounts vote, never guests
router.use(authenticateToken);

router.get('/:id', pollsController.getPoll);
router.post('/:id/vote', validateBody(pollVoteSchema), pollsController.vote);

export default router;
