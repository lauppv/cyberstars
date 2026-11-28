import type { Request, Response, NextFunction } from 'express';
import { AppError } from '@cyberstars-framework/server-kit/errors';
import * as blocksService from '../services/blocks.service.js';

function targetId(req: Request): number {
  const id = parseInt(req.params.userId as string);
  if (isNaN(id)) throw new AppError(400, 'Invalid user ID');
  return id;
}

export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.json({ users: await blocksService.list(req.user!.id) });
  } catch (err) {
    next(err);
  }
}

export async function block(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await blocksService.block(req.user!.id, targetId(req));
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

export async function unblock(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await blocksService.unblock(req.user!.id, targetId(req));
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}
