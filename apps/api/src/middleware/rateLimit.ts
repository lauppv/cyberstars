import type { Request } from 'express';
import { makeLimiter } from '@cyberstars-framework/server-kit/rate-limit';
import { config } from '../config/index.js';

// Every limiter of the API; tests go through them unless one says otherwise
export const limiter = makeLimiter(() => config.isTest);

// New support tickets, from the support form and from reporting a message
// alike: each notifies every admin, so they share one bucket of 5 in 15
// minutes per account (a class shares one school IP). authenticateToken runs
// before it, so req.user is always set.
export const newTicketLimiter = limiter({
  windowMs: 15 * 60_000,
  limit: 5,
  keyGenerator: (req: Request) => String(req.user!.id),
});
