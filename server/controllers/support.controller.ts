import type { Request, Response, NextFunction } from "express";
import type { SupportTicket, User } from "@prisma/client";
import { AppError } from "../middleware/errorHandler.js";
import * as userRepo from "../repositories/user.repository.js";
import * as supportService from "../services/support.service.js";
import type { SupportTicketDTO, SupportMessageDTO } from "../../shared/support.js";

function toDTO(t: SupportTicket): SupportTicketDTO {
  return {
    id: t.id,
    type: t.type,
    subject: t.subject,
    message: t.message,
    status: t.status,
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt.toISOString(),
  };
}

export async function createTicket(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const { type, subject, message } = req.body;

    const ticket = await supportService.create(userId, type, subject.trim(), message.trim());

    res.status(201).json({ ticketId: ticket.id });
  } catch (err) {
    next(err);
  }
}

export async function getMyTickets(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const tickets = await supportService.findByUser(req.user!.id);
    res.json(tickets.map(toDTO));
  } catch (err) {
    next(err);
  }
}

export async function getAllTickets(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const role = await userRepo.getRole(req.user!.id);
    if (role !== "ADMIN") throw new AppError(403, "Only admins can view all tickets");

    const tickets = await supportService.findAll();

    const result: SupportTicketDTO[] = tickets.map(
      (t: SupportTicket & { user: Pick<User, "name" | "email"> }) => ({
        ...toDTO(t),
        authorName: t.user.name,
        authorEmail: t.user.email,
      })
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function updateTicketStatus(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.id;
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) throw new AppError(400, "Invalid ticket ID");

    const { status } = req.body;

    const ticket = await supportService.findById(id);
    if (!ticket) throw new AppError(404, "Ticket not found");

    const role = await userRepo.getRole(userId);
    if (role !== "ADMIN") {
      if (ticket.userId !== userId) throw new AppError(403, "Not authorized");
      if (status !== "CLOSED") throw new AppError(403, "You can only close your own tickets");
    }

    await supportService.updateStatus(id, status);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

export async function getTicketMessages(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const ticketId = parseInt(req.params.id as string);
    if (isNaN(ticketId)) throw new AppError(400, "Invalid ticket ID");

    const ticket = await supportService.findById(ticketId);
    if (!ticket) throw new AppError(404, "Ticket not found");

    const role = await userRepo.getRole(userId);
    if (role !== "ADMIN" && ticket.userId !== userId) {
      throw new AppError(403, "Not authorized");
    }

    const messages = await supportService.getMessages(ticketId);

    const result: SupportMessageDTO[] = messages.map((m) => ({
      id: m.id,
      userId: m.userId,
      authorName: m.user.name,
      isAdmin: m.user.role === "ADMIN",
      message: m.message,
      createdAt: m.createdAt.toISOString(),
    }));
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function addTicketMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const ticketId = parseInt(req.params.id as string);
    if (isNaN(ticketId)) throw new AppError(400, "Invalid ticket ID");

    const { message } = req.body;

    const ticket = await supportService.findById(ticketId);
    if (!ticket) throw new AppError(404, "Ticket not found");

    const role = await userRepo.getRole(userId);
    if (role !== "ADMIN" && ticket.userId !== userId) {
      throw new AppError(403, "Not authorized");
    }

    await supportService.addMessage(ticketId, userId, message.trim());

    res.status(201).json({ ok: true });
  } catch (err) {
    next(err);
  }
}
