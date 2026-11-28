import { prisma } from '../config/db.js';
import * as userRepo from '../repositories/user.repository.js';
import * as notificationsService from './notifications.service.js';
import type { TicketType, TicketStatus } from '@prisma/client';

export function create(userId: number, type: TicketType, subject: string, message: string) {
  return prisma.supportTicket.create({
    data: { userId, type, subject, message },
  });
}

// A new ticket, which every admin hears about (the actor, if themselves an
// admin, is excluded inside notify). Once the ticket is saved the bell is best
// effort: a failure there never fails the request, whose retry would open a
// second ticket.
export async function openTicket(
  userId: number,
  type: TicketType,
  subject: string,
  message: string,
): Promise<number> {
  const ticket = await create(userId, type, subject, message);
  void userRepo
    .getAdminIds()
    .then((recipientIds) =>
      notificationsService.notify({
        recipientIds,
        actorId: userId,
        type: 'SUPPORT_TICKET_NEW',
        entityId: ticket.id,
        data: { title: ticket.subject },
      }),
    )
    .catch((err) => console.error(`[support] admin bell for ticket ${ticket.id} failed:`, err));
  return ticket.id;
}

export function findByUser(userId: number) {
  return prisma.supportTicket.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

export function findAll() {
  return prisma.supportTicket.findMany({
    orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
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
    orderBy: { createdAt: 'asc' },
    include: { user: { select: { name: true, role: true } } },
  });
}

export function addMessage(ticketId: number, userId: number, message: string) {
  return prisma.supportMessage.create({
    data: { ticketId, userId, message },
  });
}
