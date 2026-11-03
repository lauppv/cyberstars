import type { Request, Response, NextFunction } from 'express';
import { AppError } from '@cyberstars-framework/server-kit/errors';
import * as pollsService from '../services/polls.service.js';

function pollId(req: Request): number {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) throw new AppError(400, 'Invalid poll ID');
  return id;
}

export async function getPoll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.json(await pollsService.get(pollId(req), req.user!.id));
  } catch (err) {
    next(err);
  }
}

export async function vote(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await pollsService.vote(pollId(req), req.user!.id, req.body.optionIds);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
