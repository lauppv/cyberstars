import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import type { TokenPayload } from '../../shared/auth.js';
import * as userRepo from '../repositories/user.repository.js';

export function authenticateToken(req: Request, res: Response, next: NextFunction): void {
  const token = req.cookies?.token;

  if (!token) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }

  try {
    const payload = jwt.verify(token, config.jwt.secret) as TokenPayload;
    req.user = payload;
    next();
  } catch {
    res.status(403).json({ error: 'Invalid token' });
  }
}

// Must run AFTER authenticateToken. The role is never trusted from the JWT
// (which only carries { id }) — it is read fresh from the DB by the
// authenticated user id, so a tampered client/cookie cannot escalate.
export async function requireAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const role = await userRepo.getRole(req.user!.id);
    if (role !== 'ADMIN') {
      res.status(403).json({ error: 'Admin access required' });
      return;
    }
    next();
  } catch (err) {
    next(err);
  }
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
  const token = req.cookies?.token;

  if (token) {
    try {
      const payload = jwt.verify(token, config.jwt.secret) as TokenPayload;
      req.user = payload;
    } catch {
      // Invalid token - continue without auth
    }
  }

  next();
}
