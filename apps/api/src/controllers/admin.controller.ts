import type { Request, Response, NextFunction } from 'express';
import * as adminService from '../services/admin.service.js';
import * as notificationsService from '../services/notifications.service.js';
import type { AnnouncementSentDTO } from '@cyberstars/shared/admin';

export async function getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // An admin can force a cache-bypassing recompute via ?fresh=1 (rare, gated).
    const stats = await adminService.getStats(req.query.fresh === '1');
    res.json(stats);
  } catch (err) {
    next(err);
  }
}

export async function sendAnnouncement(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const sent = await notificationsService.announce(req.user!.id, req.body.text);
    const body: AnnouncementSentDTO = { sent };
    res.status(201).json(body);
  } catch (err) {
    next(err);
  }
}

export async function getAnnouncements(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    res.json(await notificationsService.listAnnouncements());
  } catch (err) {
    next(err);
  }
}
