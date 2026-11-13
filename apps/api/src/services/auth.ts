import { createAuth, type SessionStore, type UserStore } from '@cyberstars-framework/auth/auth';
import type { z } from 'zod';
import { isAdmin, type AuthenticatedUser, type UserRole } from '@cyberstars/shared/auth';
import type { Interest } from '@cyberstars/shared/interests';
import { isCodeLanguage } from '@cyberstars/shared/constants';
import { placementLevel } from '@cyberstars/shared/placement';
import * as userRepo from '../repositories/user.repository.js';
import * as sessionRepo from '../repositories/session.repository.js';
import { signupSchema } from '../schemas/auth.schema.js';
import { limiter } from '../middleware/rateLimit.js';
import { config } from '../config/index.js';
import { sendResetCode } from './email.service.js';
import { closeUserSockets } from './ws-user.js';

type Signup = z.infer<typeof signupSchema>;
type Account = NonNullable<Awaited<ReturnType<typeof userRepo.findById>>>;

// A second account on an email: Prisma's unique constraint error
function isEmailTaken(err: unknown): boolean {
  return !!err && typeof err === 'object' && 'code' in err && err.code === 'P2002';
}

// CyberStars' accounts as the auth package reaches them. The user table and its
// queries stay here, and so does the rule that the founder's email signs up as
// FOUNDER and the first account as ADMIN (userRepo.create)
const store: UserStore<UserRole, Account, Signup> = {
  async create({ name, email, passwordHash, placementScore }) {
    try {
      return await userRepo.create(name, email, passwordHash, placementScore);
    } catch (err) {
      if (isEmailTaken(err)) return null;
      throw err;
    }
  },
  async findLogin(email) {
    const user = await userRepo.findByEmail(email);
    return user && { id: user.id, passwordHash: user.password };
  },
  findById: (id) => userRepo.findById(id),
  role: (id) => userRepo.findRole(id),
  async passwordHash(id) {
    return (await userRepo.findByIdWithPassword(id))?.password ?? null;
  },
  setPassword: (id, passwordHash) => userRepo.updatePassword(id, passwordHash),
  setResetCode: (email, code, expiresAt) => userRepo.setResetCode(email, code, expiresAt),
  takeResetAttempt: (email, maxAttempts) => userRepo.takeResetAttempt(email, maxAttempts),
  async findResetCode(email, code) {
    return (await userRepo.findByResetCode(email, code))?.id ?? null;
  },
};

// The signed-in browsers, in `sessions`
const sessions: SessionStore<UserRole> = {
  create: sessionRepo.create,
  find: sessionRepo.find,
  touch: sessionRepo.touch,
  delete: sessionRepo.remove,
  deleteForUser: sessionRepo.removeForUser,
  deleteExpired: sessionRepo.removeExpired,
};

// The account answer (GET /auth/me): the package's id, name, email and role,
// with the profile on top
export function accountAnswer(user: Account): AuthenticatedUser {
  const now = new Date();
  const statusExpired = user.statusExpiresAt && user.statusExpiresAt < now;
  // Only surface a pending email change while the confirmation code is still
  // valid; expired requests should look like nothing is pending.
  const pendingEmailActive =
    user.pendingEmail && user.emailChangeCodeExpiresAt && user.emailChangeCodeExpiresAt > now
      ? user.pendingEmail
      : null;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatarUrl: user.avatarUrl,
    bio: user.bio,
    status: statusExpired ? null : user.status,
    statusExpiresAt: statusExpired ? null : (user.statusExpiresAt?.toISOString() ?? null),
    pendingEmail: pendingEmailActive,
    createdAt: user.createdAt.toISOString(),
    showBio: user.showBio,
    showStats: user.showStats,
    showProgress: user.showProgress,
    showConnections: user.showConnections,
    onboardedAt: user.onboardedAt?.toISOString() ?? null,
    placementLevel: user.placementScore === null ? null : placementLevel(user.placementScore),
    interests: user.interestsAt ? (user.interests as Interest[]) : null,
    codeLanguage: isCodeLanguage(user.codeLanguage) ? user.codeLanguage : null,
  };
}

// Sign-up, login, sessions and the password reset (framework/auth). A logout,
// a password change or a reset also closes the account's notification sockets,
// so each tab reconnects and only one whose session is still live gets back in
export const auth = createAuth({
  store,
  sessions,
  isAdmin,
  ...config.session,
  onSessionsEnded: closeUserSockets,
  signupSchema,
  emailLanguages: ['en', 'ro'],
  sendResetCode,
  account: accountAnswer,
  limiter,
});

const HOUR_MS = 60 * 60 * 1000;

// Deletes the sessions past their lifetime: once at start and then every hour,
// so a browser that never came back leaves no row behind
export function scheduleSessionSweep(): NodeJS.Timeout {
  const run = () =>
    auth.deleteExpiredSessions().catch((err) => console.error('[sessions] sweep failed:', err));
  void run();
  return setInterval(run, HOUR_MS).unref();
}
