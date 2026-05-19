import { prisma } from "../config/db.js";
import type { TicketType, TicketStatus } from "@prisma/client";

export function create(userId: number, type: TicketType, subject: string, message: string) {
  return prisma.supportTicket.create({
    data: { userId, type, subject, message },
  });
}

export function findByUser(userId: number) {
  return prisma.supportTicket.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export function findAll() {
  return prisma.supportTicket.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    include: { user: { select: { name: true, email: true } } },
  });
}

export function findById(id: number) {
  return prisma.supportTicket.findUnique({ where: { id } });
}

export function updateStatus(id: number, status: TicketStatus) {
  return prisma.supportTicket.update({ where: { id }, data: { status } });
}

export function getMessages(ticketId: number) {
  return prisma.supportMessage.findMany({
    where: { ticketId },
    orderBy: { createdAt: "asc" },
    include: { user: { select: { name: true, role: true } } },
  });
}

export function addMessage(ticketId: number, userId: number, message: string) {
  return prisma.supportMessage.create({
    data: { ticketId, userId, message },
  });
}
