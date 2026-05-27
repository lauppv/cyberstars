import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import {
  createTicketSchema,
  addMessageSchema,
  updateTicketStatusSchema,
} from '../schemas/support.schema.js';
import * as supportController from '../controllers/support.controller.js';

const router = Router();

router.post(
  '/tickets',
  authenticateToken,
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
  validateBody(addMessageSchema),
  supportController.addTicketMessage,
);

export default router;
