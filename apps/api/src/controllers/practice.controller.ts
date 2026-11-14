import type { Request, Response, NextFunction } from 'express';
import { PRACTICE_MAX_WAIT_S } from '@cyberstars/shared/practice';
import * as practice from '../services/practice.service.js';

// The practice API's answers (CYB-115). Every one is JSON, and an error says
// in its `error` what to change, since a student reads it in the console.

// `?wait=2` holds a read for two seconds, so a student sees their page while
// it loads; anything else, or more than the most, is left out or cut down
export async function held(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const seconds = Number(req.query.wait);
  if (Number.isFinite(seconds) && seconds > 0) {
    const ms = Math.min(seconds, PRACTICE_MAX_WAIT_S) * 1000;
    await new Promise((done) => setTimeout(done, ms));
  }
  next();
}

export function listStarships(_req: Request, res: Response): void {
  res.json(practice.STARSHIPS);
}

export function getStarship(req: Request, res: Response): void {
  const id = Number(req.params.id);
  const starship = Number.isInteger(id) ? practice.findStarship(id) : undefined;
  if (!starship) {
    res.status(404).json({ error: `No starship has the id ${req.params.id}.` });
    return;
  }
  res.json(starship);
}

export function listCrew(_req: Request, res: Response): void {
  res.json(practice.CREW);
}

export function reportStarship(req: Request, res: Response): void {
  const reported = practice.reportStarship(req.body);
  if (!reported.ok) {
    res.status(400).json({ error: reported.error });
    return;
  }
  res.status(201).json(reported.starship);
}

// An address that always fails, for the lessons about errors
export function broken(_req: Request, res: Response): void {
  res.status(500).json({ error: 'The tracker is down for repairs. Try again later.' });
}

export function notFound(_req: Request, res: Response): void {
  res.status(404).json({
    error: 'The practice API has no such address. Try /api/practice/starships.',
  });
}

// A body that isn't JSON, or is too long, answered like the rest
export function badBody(err: unknown, _req: Request, res: Response, next: NextFunction): void {
  const status = (err as { status?: number })?.status;
  if (status === 400 || status === 413) {
    res.status(status).json({
      error:
        status === 413
          ? 'That is too much to send.'
          : 'The body is not JSON: send it with JSON.stringify().',
    });
    return;
  }
  next(err);
}
