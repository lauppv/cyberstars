import type { Request, Response, NextFunction } from 'express';
import * as visitsService from '../services/visits.service.js';
import * as userRepo from '../repositories/user.repository.js';
import { isAdmin } from '@cyberstars/shared/auth';
import { VISIT_RANGES } from '@cyberstars/shared/visits';

// An admin's own visits (the admin page, testing a lesson) aren't counted:
// they'd only blur what strangers do.
async function byAdmin(req: Request): Promise<boolean> {
  return req.user !== undefined && isAdmin(await userRepo.getRole(req.user.id));
}

// The app's report of a page it showed. Counting must never get in the way of
// the visitor, so a failure is only logged and the answer is always a 204.
export async function recordPageView(req: Request, res: Response): Promise<void> {
  try {
    if (!(await byAdmin(req))) {
      await visitsService.recordPageView(
        req.body,
        req.ip ?? '',
        req.get('user-agent'),
        req.user !== undefined,
      );
    }
  } catch (err) {
    console.error('[visits] could not record a page view:', err);
  }
  res.status(204).end();
}

// A guest's clicks and scrolls on the page they're still on, the same way.
export async function recordSteps(req: Request, res: Response): Promise<void> {
  try {
    if (!(await byAdmin(req))) {
      await visitsService.recordSteps(req.body, req.ip ?? '', req.get('user-agent'));
    }
  } catch (err) {
    console.error('[visits] could not record steps:', err);
  }
  res.status(204).end();
}

function rangeOf(req: Request) {
  const asked = Number(req.query.range);
  return VISIT_RANGES.find((r) => r === asked) ?? VISIT_RANGES[0];
}

export async function getVisits(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.json(await visitsService.report(rangeOf(req)));
  } catch (err) {
    next(err);
  }
}

export async function getGuestVisits(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { source } = req.query;
    const before = Number(req.query.before);
    res.json(
      await visitsService.guestVisits(rangeOf(req), {
        source: typeof source === 'string' && source.length <= 100 ? source : undefined,
        before: Number.isSafeInteger(before) && before > 0 ? before : undefined,
      }),
    );
  } catch (err) {
    next(err);
  }
}
