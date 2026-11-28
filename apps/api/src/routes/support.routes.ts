import { Router, type Request } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { limiter, newTicketLimiter } from '../middleware/rateLimit.js';
import { validateBody } from '@cyberstars-framework/server-kit/validate';
import {
  createTicketSchema,
  addMessageSchema,
  updateTicketStatusSchema,
} from '../schemas/support.schema.js';
import * as supportController from '../controllers/support.controller.js';

// Keyed per account, not per IP, since a class shares one school IP.
// authenticateToken runs first, so req.user is always set here.
const perUser = (req: Request) => String(req.user!.id);

// Every reply of a student notifies every admin, as a new ticket does
// (`newTicketLimiter`, shared with reporting a message), so replies are
// capped too: a conversation about a ticket, the admins' answers included.
const replyLimiter = limiter({
  windowMs: 60_000,
  limit: 20,
  keyGenerator: perUser,
});

const router = Router();

router.post(
  '/tickets',
  authenticateToken,
  newTicketLimiter,
  validateBody(createTicketSchema),
  supportController.createTicket,
);
router.get('/tickets/mine', authenticateToken, supportController.getMyTickets);
router.get('/tickets', authenticateToken, supportController.getAllTickets);
router.put(
  '/tickets/:id/status',
  authenticateToken,
  validateBody(updateTicketStatusSchema),
  supportController.updateTicketStatus,
);
router.get('/tickets/:id/messages', authenticateToken, supportController.getTicketMessages);
router.post(
  '/tickets/:id/messages',
  authenticateToken,
  replyLimiter,
  validateBody(addMessageSchema),
  supportController.addTicketMessage,
);

export default router;
