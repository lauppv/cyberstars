import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { authenticateToken, requireFeatureAccess } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import {
  openConversationSchema,
  sendMessageSchema,
  markReadSchema,
} from '../schemas/messages.schema.js';
import * as messagesController from '../controllers/messages.controller.js';

// Cap message sends per user; abuse is otherwise held in check by this + (later)
// the block feature. Reads are cheap and unlimited.
const sendLimiter = rateLimit({
  windowMs: 60_000,
  /* v8 ignore next -- NODE_ENV ternary evaluated at module load; only the 'test' branch runs in tests. */
  limit: process.env.NODE_ENV === 'test' ? 10_000 : 20,
});

const router = Router();

// Messaging requires an identity (no guests) and passes the preview gate: on
// prod a non-admin gets 404, so the feature stays hidden until launch.
router.use(authenticateToken, requireFeatureAccess('messaging'));

router.get('/conversations', messagesController.getInbox);
router.post(
  '/conversations',
  validateBody(openConversationSchema),
  messagesController.openConversation,
);
router.get('/conversations/:id', messagesController.getHistory);
router.post(
  '/conversations/:id',
  sendLimiter,
  validateBody(sendMessageSchema),
  messagesController.sendMessage,
);
router.post('/conversations/:id/read', validateBody(markReadSchema), messagesController.markRead);
router.delete('/:messageId', messagesController.deleteMessage);

export default router;
