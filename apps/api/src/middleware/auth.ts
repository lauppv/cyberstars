import type { Request, Response, NextFunction } from 'express';
import { isAdmin } from '@cyberstars/shared/auth';
import * as userRepo from '../repositories/user.repository.js';
import { sessionUserId } from '../services/auth.service.js';

// A session ended by a password change gets the same answer as an expired one
export async function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const token = req.cookies?.token;

  if (!token) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }

  try {
    const id = await sessionUserId(token);
    if (id === null) {
      res.status(403).json({ error: 'Invalid token' });
      return;
    }
    req.user = { id };
    next();
  } catch (err) {
    next(err);
  }
}

// Must run AFTER authenticateToken. The role is never trusted from the JWT
// (which only carries { id }); it is read fresh from the DB by the
// authenticated user id, so a tampered client/cookie cannot escalate.
export async function requireAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const role = await userRepo.getRole(req.user!.id);
    if (!isAdmin(role)) {
      res.status(403).json({ error: 'Admin access required' });
      return;
    }
    next();
  } catch (err) {
    next(err);
  }
}

// An invalid, expired or ended session continues as a guest
export async function optionalAuth(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id = await sessionUserId(req.cookies?.token);
    if (id !== null) req.user = { id };
    next();
  } catch (err) {
    next(err);
  }
}
