import { Router } from "express";
import { authenticateToken } from "../middleware/auth.js";
import * as supportController from "../controllers/support.controller.js";

const router = Router();

router.post("/tickets", authenticateToken, supportController.createTicket);
router.get("/tickets/mine", authenticateToken, supportController.getMyTickets);
router.get("/tickets", authenticateToken, supportController.getAllTickets);
router.put("/tickets/:id/status", authenticateToken, supportController.updateTicketStatus);
router.get("/tickets/:id/messages", authenticateToken, supportController.getTicketMessages);
router.post("/tickets/:id/messages", authenticateToken, supportController.addTicketMessage);

export default router;
