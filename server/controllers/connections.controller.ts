import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/errorHandler.js';
import * as connectionsService from '../services/connections.service.js';

function connectionId(req: Request): number {
  const id = parseInt(req.params.id as string);
  if (isNaN(id)) throw new AppError(400, 'Invalid connection ID');
  return id;
}

export async function getOverview(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.json(await connectionsService.getOverview(req.user!.id));
  } catch (err) {
    next(err);
  }
}

export async function sendRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await connectionsService.sendRequest(req.user!.id, req.body.addresseeId);
    res.status(201).json({ ok: true });
  } catch (err) {
    next(err);
  }
}

export async function accept(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await connectionsService.accept(req.user!.id, connectionId(req));
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

export async function decline(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await connectionsService.decline(req.user!.id, connectionId(req));
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await connectionsService.removeByCaller(req.user!.id, connectionId(req));
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}
