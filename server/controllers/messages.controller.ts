import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/errorHandler.js';
import * as messagesService from '../services/messages.service.js';
import { historyQuerySchema } from '../schemas/messages.schema.js';

function conversationId(req: Request): number {
  const id = parseInt(req.params.id as string);
  if (isNaN(id)) throw new AppError(400, 'Invalid conversation ID');
  return id;
}

export async function getInbox(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.json({ conversations: await messagesService.getInbox(req.user!.id) });
  } catch (err) {
    next(err);
  }
}

export async function openConversation(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const conversation = await messagesService.openConversation(req.user!.id, req.body.recipientId);
    res.status(201).json({ conversation });
  } catch (err) {
    next(err);
  }
}

export async function getHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { take, before } = historyQuerySchema.parse(req.query);
    res.json(await messagesService.getHistory(req.user!.id, conversationId(req), take, before));
  } catch (err) {
    next(err);
  }
}

export async function sendMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const message = await messagesService.sendMessage(
      req.user!.id,
      conversationId(req),
      req.body.content,
    );
    res.status(201).json({ message });
  } catch (err) {
    next(err);
  }
}

export async function markRead(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await messagesService.markRead(req.user!.id, conversationId(req), req.body.upToMessageId);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

export async function deleteMessage(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id = parseInt(req.params.messageId as string);
    if (isNaN(id)) throw new AppError(400, 'Invalid message ID');
    const message = await messagesService.deleteMessage(req.user!.id, id);
    res.json({ message });
  } catch (err) {
    next(err);
  }
}
