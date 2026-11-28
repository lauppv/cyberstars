import type { Request, Response } from 'express';
import { isWaiting, waitKey } from '../services/run-waits.js';
import { guestKey } from '../services/guest-id.js';

// Who is asking, the same way on every route that runs code: a request that
// waits and the page asking about it have to agree on it
function ownerOf(req: Request): string | null {
  if (req.user?.id) return `user:${req.user.id}`;
  return guestKey(req.cookies?.guestId);
}

// The key a Run Tests or terminal command waits under, from the id the page sent
export function requestWaitKey(req: Request): string | null {
  return waitKey(ownerOf(req), req.get('X-Run-Id'));
}

export function runWaiting(req: Request, res: Response): void {
  res.json({ waiting: isWaiting(waitKey(ownerOf(req), req.params.runId)) });
}
