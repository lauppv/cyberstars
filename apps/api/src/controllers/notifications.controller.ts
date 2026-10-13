import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/errorHandler.js';
import * as notificationsService from '../services/notifications.service.js';
import { notificationsQuerySchema } from '../schemas/notifications.schema.js';

export async function getNotifications(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { take, before } = notificationsQuerySchema.parse(req.query);
    const page = await notificationsService.getPage(req.user!.id, take, before);
    res.json(page);
  } catch (err) {
    next(err);
  }
}

export async function markRead(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await notificationsService.markRead(req.user!.id, req.body.upToId);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

export async function markOneRead(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) throw new AppError(400, 'Invalid notification ID');
    await notificationsService.markOneRead(req.user!.id, id);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}
