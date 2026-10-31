import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Router, type Request, type Response, type NextFunction } from 'express';
import type { ZodType } from 'zod';
import { AppError } from '@cyberstars-framework/server-kit/errors';
import type { makeLimiter } from '@cyberstars-framework/server-kit/rate-limit';
import { validateBody } from '@cyberstars-framework/server-kit/validate';
import { forgotPasswordSchema, loginSchema, resetPasswordSchema } from './schemas.js';
import './request.js';

export type { SessionUser } from './request.js';

// The cookie that carries the session token. Read through req.cookies, so the
// app parses cookies (cookie-parser) before the checks run
export const SESSION_COOKIE = 'token';

// What the package knows of an account
export interface AuthUser<Role extends string = string> {
  id: number;
  name: string;
  email: string;
  role: Role;
}

// What sign-up needs at least; an app's form may ask for more
export interface SignupFields {
  name: string;
  email: string;
  password: string;
}

// The app's own user records, which the package reaches only through these.
// The user table stays the app's: every feature of the app hangs off it
export interface UserStore<
  Role extends string,
  User extends AuthUser<Role>,
  Signup extends SignupFields,
> {
  // Makes an account from the sign-up form, its password already hashed, with
  // the role the app gives a new account; null when the email is taken
  create(fields: Omit<Signup, 'password'> & { passwordHash: string }): Promise<number | null>;
  // What a login needs of the account with this email, null when none has it
  findLogin(
    email: string,
  ): Promise<{ id: number; passwordHash: string; sessionVersion: number } | null>;
  // The account, for the account answer; null when it is gone
  findById(id: number): Promise<User | null>;
  // The account's role, null when the account is gone
  role(id: number): Promise<Role | null>;
  // The account's session version, null when the account is gone
  sessionVersion(id: number): Promise<number | null>;
  // The account's password hash, null when the account is gone
  passwordHash(id: number): Promise<string | null>;
  // Keeps a new password hash, clears any reset code and raises the session
  // version, in one write; returns the new version
  setPassword(id: number, passwordHash: string): Promise<number>;
  // Gives the account with this email a new reset code with all its tries;
  // false when no account has the email
  setResetCode(email: string, code: string, expiresAt: Date): Promise<boolean>;
  // Takes one of the live reset code's tries in a single write, so guesses
  // sent at once can't all read the same count; false when the code expired,
  // has no tries left, or the email has none
  takeResetAttempt(email: string, maxAttempts: number): Promise<boolean>;
  // The account whose live reset code this is, null when none
  findResetCode(email: string, code: string): Promise<number | null>;
}

export interface AuthOptions<
  Role extends string,
  User extends AuthUser<Role>,
  Signup extends SignupFields,
  Lang extends string,
> {
  store: UserStore<Role, User, Signup>;
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
  // The sign-up form, with the app's own rules (schemas.ts has the package's
  // for the email and the password); what it adds goes to store.create
  signupSchema: ZodType<Signup>;
  // The languages a reset email can be asked in, the first when none is
  emailLanguages: readonly [Lang, ...Lang[]];
  // Sends a reset code, valid for 15 minutes, in the language asked
  sendResetCode: (to: string, code: string, lang: Lang) => Promise<void>;
  // The account answer (GET /me): the app's own from the account, or the
  // account's id, name, email and role
  account?: (user: User) => unknown;
  // Makes the routes' rate limits: the app's own (server-kit's makeLimiter),
  // so they follow its rule for tests
  limiter: ReturnType<typeof makeLimiter>;
}

// What a session token carries: who, and the account's session version when it
// was made. A password change raises the version and ends the token; a token
// without one counts as version 0
interface TokenPayload {
  id: number;
  v?: number;
}

// Kept in one place because the dummy-hash timing defense below only works if
// every hash (real and throwaway) uses the same cost.
const BCRYPT_COST = 10;

// How long a reset code lasts
const RESET_CODE_MINUTES = 15;

// Tries one reset code gets, from all IPs together; with three codes an hour
// per email an account faces at most 15 guesses an hour
const MAX_RESET_ATTEMPTS = 5;

// Accounts and sessions: a signed token in an httpOnly cookie, checked against
// the account's session version on every request. An app creates one with its
// user store, its admin rule, its session settings and its sign-up form, and
// mounts `router` for sign-up, login, logout, the password reset and the
// account answer. The routes throw AppError, so the app mounts server-kit's
// errorHandler after them.
export function createAuth<
  Role extends string,
  User extends AuthUser<Role>,
  Signup extends SignupFields,
  Lang extends string,
>(options: AuthOptions<Role, User, Signup, Lang>) {
  const { store, secret, maxAgeMs, secureCookie, limiter } = options;

  // A throwaway hash compared against when the email is unknown. Running one
  // bcrypt comparison on every login keeps response timing the same whether
  // or not the account exists, so timing can't be used to enumerate users.
  const DUMMY_PASSWORD_HASH = hashPassword(crypto.randomUUID());

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

  const authLimiter = limiter({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    message: { error: 'Too many attempts, try again later' },
  });

  // Keyed by the email, not the IP: three reset codes an hour per address from
  // all IPs together, counted whether or not an account uses it so the answer
  // never tells. Runs after validation, so the email is always there. On in
  // tests too, since they check the limit
  const resetCodeLimiter = limiter({
    windowMs: 60 * 60 * 1000,
    limit: 3,
    alsoInTests: true,
    keyGenerator: (req) => req.body.email,
    message: { error: 'Too many codes asked for this email, try again later' },
  });

  const router = Router();

  router.post('/signup', authLimiter, validateBody(options.signupSchema), async (req, res) => {
    const { password, ...fields } = req.body as Signup;
    const id = await store.create({ ...fields, passwordHash: hashPassword(password) });
    if (id === null) throw new AppError(409, 'User already exists');
    setSessionCookie(res, createToken(id, 0));
    res.json({ message: 'User created successfully' });
  });

  router.post('/login', authLimiter, validateBody(loginSchema), async (req, res) => {
    const { email, password } = req.body as { email: string; password: string };
    const account = await store.findLogin(email);

    // One generic message for both "no such email" and "wrong password" so the
    // response never reveals which accounts exist (user enumeration).
    const valid = bcrypt.compareSync(password, account?.passwordHash ?? DUMMY_PASSWORD_HASH);
    if (!account || !valid) {
      throw new AppError(401, 'Invalid email or password');
    }

    setSessionCookie(res, createToken(account.id, account.sessionVersion));
    res.json({ message: 'Login successful' });
  });

  router.post('/logout', (_req, res) => {
    res.clearCookie(SESSION_COOKIE, { httpOnly: true, secure: secureCookie, sameSite: 'lax' });
    res.json({ message: 'Logged out successfully' });
  });

  router.post(
    '/forgot-password',
    authLimiter,
    validateBody(forgotPasswordSchema(options.emailLanguages)),
    resetCodeLimiter,
    async (req, res) => {
      const { email, lang } = req.body as { email: string; lang?: Lang };
      const code = crypto.randomInt(100_000, 999_999).toString();
      const expiresAt = new Date(Date.now() + RESET_CODE_MINUTES * 60 * 1000);
      if (await store.setResetCode(email, code, expiresAt)) {
        // Send outside the request path: keeps response timing for known vs
        // unknown emails close (no awaited email round-trip), and a
        // mail-provider failure doesn't 500 the request or strand the reset
        // code already stored.
        void options.sendResetCode(email, code, lang ?? options.emailLanguages[0]).catch((err) => {
          console.error('[forgot-password] failed to send reset code:', err);
        });
      }
      res.json({ message: 'If that email exists, a reset code was sent' });
    },
  );

  router.post(
    '/reset-password',
    authLimiter,
    validateBody(resetPasswordSchema),
    async (req, res) => {
      const { email, code, password } = req.body as {
        email: string;
        code: string;
        password: string;
      };
      // Every try takes one, the right one too, so the right code after five
      // wrong ones is refused as well
      if (!(await store.takeResetAttempt(email, MAX_RESET_ATTEMPTS))) {
        throw new AppError(400, 'This code has expired or used up its attempts, ask for a new one');
      }
      const id = await store.findResetCode(email, code);
      if (id === null) {
        throw new AppError(400, 'Invalid or expired code');
      }
      await setPassword(id, password);
      res.json({ message: 'Password reset successfully' });
    },
  );

  router.get('/me', authenticateToken, async (req, res) => {
    const user = await store.findById(req.user!.id);
    if (!user) throw new AppError(404, 'User not found');
    const { id, name, email, role } = user;
    res.json(options.account ? await options.account(user) : { id, name, email, role });
  });

  return {
    router,
    authenticateToken,
    optionalAuth,
    requireAdmin,
    sessionUserId,
    setSessionCookie,
    setPassword,
    checkCurrentPassword,
  };
}
