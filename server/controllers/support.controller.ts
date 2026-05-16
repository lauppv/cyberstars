import type { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import type { SupportTicket, User } from "@prisma/client";
import { AppError } from "../middleware/errorHandler.js";
import * as userRepo from "../repositories/user.repository.js";
import type { SupportTicketDTO } from "../../shared/support.js";

const prisma = new PrismaClient();

const TICKET_TYPES = ["BUG", "QUESTION", "RULE_VIOLATION", "FEEDBACK", "ACCOUNT", "OTHER"];
const TICKET_STATUSES = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];

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

    if (!TICKET_TYPES.includes(type)) throw new AppError(400, "Invalid ticket type");
    if (!subject?.trim() || !message?.trim()) {
      throw new AppError(400, "Subject and message are required");
    }
    if (subject.trim().length > 200) throw new AppError(400, "Subject is too long (max 200 chars)");

    const ticket = await prisma.supportTicket.create({
      data: { userId, type, subject: subject.trim(), message: message.trim() },
    });

    res.status(201).json({ ticketId: ticket.id });
  } catch (err) {
    next(err);
  }
}

export async function getMyTickets(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const tickets = await prisma.supportTicket.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    res.json(tickets.map(toDTO));
  } catch (err) {
    next(err);
  }
}

export async function getAllTickets(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const role = await userRepo.getRole(req.user!.id);
    if (role !== "ADMIN") throw new AppError(403, "Only admins can view all tickets");

    const tickets = await prisma.supportTicket.findMany({
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
      include: { user: { select: { name: true, email: true } } },
    });

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
    const role = await userRepo.getRole(req.user!.id);
    if (role !== "ADMIN") throw new AppError(403, "Only admins can update tickets");

    const id = parseInt(req.params.id as string);
    if (isNaN(id)) throw new AppError(400, "Invalid ticket ID");

    const { status } = req.body;
    if (!TICKET_STATUSES.includes(status)) throw new AppError(400, "Invalid status");

    await prisma.supportTicket.update({ where: { id }, data: { status } });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}
