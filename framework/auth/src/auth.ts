import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import { AppError } from '@cyberstars-framework/server-kit/errors';
import './request.js';

export type { SessionUser } from './request.js';

// The cookie that carries the session token. Read through req.cookies, so the
// app parses cookies (cookie-parser) before the checks run
export const SESSION_COOKIE = 'token';

// The app's own user records, which the package reaches only through these.
// The user table stays the app's: every feature of the app hangs off it
export interface UserStore<Role extends string> {
  // The account's role, null when the account is gone
  role(id: number): Promise<Role | null>;
  // The account's session version, null when the account is gone
  sessionVersion(id: number): Promise<number | null>;
  // The account's password hash, null when the account is gone
  passwordHash(id: number): Promise<string | null>;
  // Keeps a new password hash, clears any reset code and raises the session
  // version, in one write; returns the new version
  setPassword(id: number, passwordHash: string): Promise<number>;
}

export interface AuthOptions<Role extends string> {
  store: UserStore<Role>;
  // Which roles may pass requireAdmin
  isAdmin: (role: Role) => boolean;
  // Signs the session tokens
  secret: string;
  // How long a session lasts, its token and its cookie alike
  maxAgeMs: number;
  // Sends the cookie over HTTPS only
  secureCookie: boolean;
  // Hears that every session of an account just ended, after a password
  // change or reset, to close what the app keeps open for them
  onSessionsEnded?: (userId: number) => void;
}

// What a session token carries: who, and the account's session version when it
// was made. A password change raises the version and ends the token; a token
// without one counts as version 0
interface TokenPayload {
  id: number;
  v?: number;
}

// Kept in one place because the dummy-hash timing defense only works if every
// hash (real and throwaway) uses the same cost.
const BCRYPT_COST = 10;

// Accounts and sessions: a signed token in an httpOnly cookie, checked against
// the account's session version on every request. An app creates one with its
// user store, its admin rule and its session settings.
export function createAuth<Role extends string>(options: AuthOptions<Role>) {
  const { store, secret, maxAgeMs, secureCookie } = options;

  function hashPassword(password: string): string {
    return bcrypt.hashSync(password, BCRYPT_COST);
  }

  function createToken(userId: number, version: number): string {
    return jwt.sign({ id: userId, v: version } satisfies TokenPayload, secret, {
      expiresIn: Math.round(maxAgeMs / 1000),
    });
  }

  // The user a session token signs in, or null when it is missing, invalid,
  // expired or ended by a password change since it was made. The WebSockets
  // ask it too, with the cookie from their upgrade request
  async function sessionUserId(token: string | null | undefined): Promise<number | null> {
    if (!token) return null;
    let payload: TokenPayload;
    try {
      payload = jwt.verify(token, secret) as TokenPayload;
    } catch {
      return null;
    }
    const version = await store.sessionVersion(payload.id);
    return version !== null && version === (payload.v ?? 0) ? payload.id : null;
  }

  // Signs this browser in with a token
  function setSessionCookie(res: Response, token: string): void {
    res.cookie(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: secureCookie,
      sameSite: 'lax',
      maxAge: maxAgeMs,
    });
  }

  // Sets a new password and ends every session of the account: their tokens
  // are behind the new version, and the app hears of it. Returns a token at the
  // new version, for the session that made a change to stay signed in
  async function setPassword(userId: number, newPassword: string): Promise<string> {
    const version = await store.setPassword(userId, hashPassword(newPassword));
    options.onSessionsEnded?.(userId);
    return createToken(userId, version);
  }

  // For a change the account's owner makes while signed in (a new password or
  // email): throws unless the password is the account's
  async function checkCurrentPassword(userId: number, password: string): Promise<void> {
    const hash = await store.passwordHash(userId);
    if (hash === null) throw new AppError(404, 'User not found');
    if (!bcrypt.compareSync(password, hash)) {
      throw new AppError(401, 'Current password is incorrect');
    }
  }

  // A session ended by a password change gets the same answer as an expired one
  async function authenticateToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    const token = req.cookies?.[SESSION_COOKIE];

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

  // An invalid, expired or ended session continues as a guest
  async function optionalAuth(req: Request, _res: Response, next: NextFunction): Promise<void> {
    try {
      const id = await sessionUserId(req.cookies?.[SESSION_COOKIE]);
      if (id !== null) req.user = { id };
      next();
    } catch (err) {
      next(err);
    }
  }

  // Must run AFTER authenticateToken. The role is never trusted from the token
  // (which only carries { id, v }); the store reads it fresh by the signed-in
  // user's id, so a tampered client or cookie cannot escalate.
  async function requireAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const role = await store.role(req.user!.id);
      if (role === null || !options.isAdmin(role)) {
        res.status(403).json({ error: 'Admin access required' });
        return;
      }
      next();
    } catch (err) {
      next(err);
    }
  }

  return {
    authenticateToken,
    optionalAuth,
    requireAdmin,
    sessionUserId,
    setSessionCookie,
    setPassword,
    checkCurrentPassword,
  };
}

export type Auth = ReturnType<typeof createAuth>;
