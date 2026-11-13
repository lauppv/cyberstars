import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import { Router, type Request, type Response, type NextFunction } from 'express';
import type { ZodType } from 'zod';
import { AppError } from '@cyberstars-framework/server-kit/errors';
import type { makeLimiter } from '@cyberstars-framework/server-kit/rate-limit';
import { validateBody } from '@cyberstars-framework/server-kit/validate';
import { forgotPasswordSchema, loginSchema, resetPasswordSchema } from './schemas.js';
import './request.js';

export type { SessionUser } from './request.js';

// The cookie that carries the session token, read through req.cookies, so the
// app parses cookies (cookie-parser) before the checks run. Over HTTPS it takes
// the __Host- prefix: the browser then keeps it only when it is Secure, for the
// whole site and set by the site itself, never by a subdomain. Over plain HTTP
// (development, tests) the browser would refuse a prefixed cookie
export function sessionCookieName(secureCookie: boolean): string {
  return secureCookie ? '__Host-session' : 'session';
}

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
  findLogin(email: string): Promise<{ id: number; passwordHash: string } | null>;
  // The account, for the account answer; null when it is gone
  findById(id: number): Promise<User | null>;
  // The account's role, null when the account is gone
  role(id: number): Promise<Role | null>;
  // The account's password hash, null when the account is gone
  passwordHash(id: number): Promise<string | null>;
  // Keeps a new password hash and clears any reset code, in one write
  setPassword(id: number, passwordHash: string): Promise<void>;
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

// A session as the app keeps it: its account, the hash of its secret (never
// the secret itself), when it was made and when it was last seen in use
export interface StoredSession<Role extends string = string> {
  userId: number;
  secretHash: string;
  createdAt: Date;
  lastSeenAt: Date;
  // The account's role now, read with the session, which sets its lifetime
  role: Role;
}

// The app's own session records. Deleting the account deletes its sessions
export interface SessionStore<Role extends string> {
  // Keeps a new session, last seen when it was made
  create(session: {
    id: string;
    userId: number;
    secretHash: string;
    createdAt: Date;
  }): Promise<void>;
  // The session with this id, null when there is none
  find(id: string): Promise<StoredSession<Role> | null>;
  // Moves the time the session was last seen in use
  touch(id: string, lastSeenAt: Date): Promise<void>;
  // Ends one session; nothing when it is gone already
  delete(id: string): Promise<void>;
  // Ends every session of the account
  deleteForUser(userId: number): Promise<void>;
  // Ends the sessions last seen before `lastSeenBefore` or made before
  // `createdBefore`; returns how many
  deleteExpired(lastSeenBefore: Date, createdBefore: Date): Promise<number>;
}

// How long a session lasts: `idleMs` after it was last used, and `absoluteMs`
// after the login however much it is used, whichever comes first
export interface SessionLifetime {
  idleMs: number;
  absoluteMs: number;
}

export interface AuthOptions<
  Role extends string,
  User extends AuthUser<Role>,
  Signup extends SignupFields,
  Lang extends string,
> {
  store: UserStore<Role, User, Signup>;
  sessions: SessionStore<Role>;
  // Which roles may pass requireAdmin
  isAdmin: (role: Role) => boolean;
  // How long a session lasts: `user` for every account, `admin` for one
  // isAdmin lets in, the most valuable to steal, so shorter
  lifetimes: { user: SessionLifetime; admin: SessionLifetime };
  // Sends the cookie over HTTPS only, under the __Host- prefix
  secureCookie: boolean;
  // Hears that sessions of an account just ended (a logout, a password change
  // or reset), to close what the app keeps open for them; whatever still has a
  // session gets back in
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

// A session token is `<id>.<secret>`, both random (CSPRNG) and base64url: the
// id finds the session (128 bits) and the secret proves it (256 bits). The app
// keeps only the secret's SHA-256, so a leak of its sessions signs no one in
const ID_BYTES = 16;
const SECRET_BYTES = 32;
const TOKEN_SHAPE = /^([A-Za-z0-9_-]{22})\.([A-Za-z0-9_-]{43})$/;

// A session in use is seen again (its idle time starts over and its cookie is
// set again) at most this often, so a busy session writes once an hour, not on
// every request
const SEEN_EVERY_MS = 60 * 60 * 1000;

// Kept in one place because the dummy-hash timing defense below only works if
// every hash (real and throwaway) uses the same cost.
const BCRYPT_COST = 10;

// How long a reset code lasts
const RESET_CODE_MINUTES = 15;

// Tries one reset code gets, from all IPs together; with three codes an hour
// per email an account faces at most 15 guesses an hour
const MAX_RESET_ATTEMPTS = 5;

// Accounts and sessions: a random token in an httpOnly cookie, kept by the app
// as a session row and checked on every request. An app creates one with its
// user and session stores, its admin rule, its session lifetimes and its
// sign-up form, and mounts `router` for sign-up, login, logout, the password
// reset and the account answer. The routes throw AppError, so the app mounts
// server-kit's errorHandler after them.
export function createAuth<
  Role extends string,
  User extends AuthUser<Role>,
  Signup extends SignupFields,
  Lang extends string,
>(options: AuthOptions<Role, User, Signup, Lang>) {
  const { store, sessions, lifetimes, secureCookie, limiter } = options;
  const cookieName = sessionCookieName(secureCookie);
  const cookieOptions = {
    httpOnly: true,
    secure: secureCookie,
    sameSite: 'lax',
    path: '/',
  } as const;

  // A throwaway hash compared against when the email is unknown. Running one
  // bcrypt comparison on every login keeps response timing the same whether
  // or not the account exists, so timing can't be used to enumerate users.
  const DUMMY_PASSWORD_HASH = hashPassword(crypto.randomUUID());

  function hashPassword(password: string): string {
    return bcrypt.hashSync(password, BCRYPT_COST);
  }

  function hashSecret(secret: string): string {
    return crypto.createHash('sha256').update(secret).digest('hex');
  }

  function lifetimeOf(role: Role): SessionLifetime {
    return options.isAdmin(role) ? lifetimes.admin : lifetimes.user;
  }

  // How long the cookie of a session seen at `seenAt` should last: until its
  // idle time runs out, or its absolute end when that comes first
  function cookieMaxAge(
    createdAt: number,
    seenAt: number,
    { idleMs, absoluteMs }: SessionLifetime,
  ) {
    return Math.min(idleMs, createdAt + absoluteMs - seenAt);
  }

  // The live session a token stands for, or null when the token is missing,
  // malformed or wrong, or its session ended, timed out or is gone. One that
  // timed out is deleted here; a wrong secret deletes nothing, so knowing an id
  // alone can't end someone's session
  async function liveSession(token: string | null | undefined) {
    const match = token ? TOKEN_SHAPE.exec(token) : null;
    if (!match) return null;
    const [, id, secret] = match as unknown as [string, string, string];
    const session = await sessions.find(id);
    if (!session) return null;
    const expected = Buffer.from(session.secretHash, 'hex');
    const given = Buffer.from(hashSecret(secret), 'hex');
    if (expected.length !== given.length || !crypto.timingSafeEqual(expected, given)) return null;
    const lifetime = lifetimeOf(session.role);
    const now = Date.now();
    const createdAt = session.createdAt.getTime();
    const lastSeenAt = session.lastSeenAt.getTime();
    if (now >= Math.min(lastSeenAt + lifetime.idleMs, createdAt + lifetime.absoluteMs)) {
      await sessions.delete(id);
      return null;
    }
    return { id, token: token!, userId: session.userId, createdAt, lastSeenAt, lifetime };
  }

  // The user a session token signs in, or null. The WebSockets ask it with the
  // cookie of their upgrade request; it doesn't count as use, since a socket
  // can't set the cookie again
  async function sessionUserId(token: string | null | undefined): Promise<number | null> {
    return (await liveSession(token))?.userId ?? null;
  }

  // The user a request's session signs in, or null. A session last seen an hour
  // ago or more is seen now: its idle time starts over, and its cookie is set
  // again to last as long as the session can. The cookie of a session that
  // ended, timed out or never was is cleared, so the browser stops sending it
  // and the app takes it for a guest again
  async function requestUserId(req: Request, res: Response): Promise<number | null> {
    const token = req.cookies?.[cookieName];
    const session = await liveSession(token);
    if (!session) {
      if (token) res.clearCookie(cookieName, cookieOptions);
      return null;
    }
    const now = Date.now();
    if (now - session.lastSeenAt >= SEEN_EVERY_MS) {
      await sessions.touch(session.id, new Date(now));
      res.cookie(cookieName, session.token, {
        ...cookieOptions,
        maxAge: cookieMaxAge(session.createdAt, now, session.lifetime),
      });
    }
    return session.userId;
  }

  // Starts a new session for the account and signs this browser in with it.
  // A login passes the password hash it checked: a password change or reset
  // that lands while the login runs deletes the sessions before this one is
  // made, so the hash is read again once it is, and the session is dropped
  // when the password moved on
  async function startSession(
    res: Response,
    userId: number,
    checkedPasswordHash?: string,
  ): Promise<void> {
    const role = await store.role(userId);
    if (role === null) throw new AppError(404, 'User not found');
    const id = crypto.randomBytes(ID_BYTES).toString('base64url');
    const secret = crypto.randomBytes(SECRET_BYTES).toString('base64url');
    const now = Date.now();
    await sessions.create({ id, userId, secretHash: hashSecret(secret), createdAt: new Date(now) });
    if (
      checkedPasswordHash !== undefined &&
      (await store.passwordHash(userId)) !== checkedPasswordHash
    ) {
      await sessions.delete(id);
      throw new AppError(401, 'Invalid email or password');
    }
    res.cookie(cookieName, `${id}.${secret}`, {
      ...cookieOptions,
      maxAge: cookieMaxAge(now, now, lifetimeOf(role)),
    });
  }

  // Ends the session this browser is signed in with, if any. A login ends it
  // too before it starts a new one, so a browser never leaves one behind
  async function endSession(req: Request): Promise<void> {
    const session = await liveSession(req.cookies?.[cookieName]);
    if (!session) return;
    await sessions.delete(session.id);
    options.onSessionsEnded?.(session.userId);
  }

  // Sets a new password and ends every session of the account, and the app
  // hears of it. The session that made a change in Settings starts a new one
  // after (startSession), so it alone stays signed in
  async function setPassword(userId: number, newPassword: string): Promise<void> {
    await store.setPassword(userId, hashPassword(newPassword));
    await sessions.deleteForUser(userId);
    options.onSessionsEnded?.(userId);
  }

  // Deletes the sessions past the longest lifetime; the app runs it now and
  // then. A shorter one is deleted when its next request finds it timed out
  function deleteExpiredSessions(): Promise<number> {
    const now = Date.now();
    const idleMs = Math.max(lifetimes.user.idleMs, lifetimes.admin.idleMs);
    const absoluteMs = Math.max(lifetimes.user.absoluteMs, lifetimes.admin.absoluteMs);
    return sessions.deleteExpired(new Date(now - idleMs), new Date(now - absoluteMs));
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

  // A session that ended, timed out or never was gets the same answer as one
  // whose cookie expired in the browser
  async function authenticateToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    if (!req.cookies?.[cookieName]) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    try {
      const id = await requestUserId(req, res);
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

  // A session that ended, timed out or never was continues as a guest
  async function optionalAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = await requestUserId(req, res);
      if (id !== null) req.user = { id };
      next();
    } catch (err) {
      next(err);
    }
  }

  // Must run AFTER authenticateToken. The role is never in the cookie (its
  // token is random, with nothing in it); the store reads it fresh by the
  // signed-in user's id, so a tampered client or cookie cannot escalate.
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

  // What the account routes answer is about one account and never to be kept by
  // a browser or a proxy
  router.use((_req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
  });

  router.post('/signup', authLimiter, validateBody(options.signupSchema), async (req, res) => {
    const { password, ...fields } = req.body as Signup;
    const id = await store.create({ ...fields, passwordHash: hashPassword(password) });
    if (id === null) throw new AppError(409, 'User already exists');
    await endSession(req);
    await startSession(res, id);
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

    await endSession(req);
    await startSession(res, account.id, account.passwordHash);
    res.json({ message: 'Login successful' });
  });

  // Ends this browser's session on the server, so a copy of its cookie signs no
  // one in either, and has the browser drop the cookie. The cookie goes first,
  // so a failed delete still signs this browser out. The account's other
  // sessions, on other devices, stay signed in
  router.post('/logout', async (req, res) => {
    res.clearCookie(cookieName, cookieOptions);
    await endSession(req);
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
    cookieName,
    authenticateToken,
    optionalAuth,
    requireAdmin,
    sessionUserId,
    startSession,
    setPassword,
    checkCurrentPassword,
    deleteExpiredSessions,
  };
}
