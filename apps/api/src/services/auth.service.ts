import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import * as userRepo from '../repositories/user.repository.js';
import * as emailService from './email.service.js';
import { closeUserSockets } from './ws-user.js';
import type { EmailLang } from './email.service.js';
import type { TokenPayload, AuthenticatedUser } from '@cyberstars/shared/auth';
import type { Interest } from '@cyberstars/shared/interests';
import { isCodeLanguage } from '@cyberstars/shared/constants';
import { placementLevel } from '@cyberstars/shared/placement';
import { AppError } from '../middleware/errorHandler.js';

// Kept in one place because the dummy-hash timing defense below only works if
// every hash (real and throwaway) uses the same cost.
const BCRYPT_COST = 10;

export async function signup(
  name: string,
  email: string,
  password: string,
  placementScore?: number,
): Promise<string> {
  const hashedPassword = bcrypt.hashSync(password, BCRYPT_COST);
  try {
    const userId = await userRepo.create(name, email, hashedPassword, placementScore);
    return createToken(userId, 0);
  } catch (err: unknown) {
    if (
      err &&
      typeof err === 'object' &&
      'code' in err &&
      (err as { code: string }).code === 'P2002'
    ) {
      throw new AppError(409, 'User already exists');
    }
    throw err;
  }
}

// A throwaway hash compared against when the email is unknown. Running one
// bcrypt comparison on every login keeps response timing the same whether or
// not the account exists, so timing can't be used to enumerate users.
const DUMMY_PASSWORD_HASH = bcrypt.hashSync('cyberstars-no-such-user', BCRYPT_COST);

export async function login(email: string, password: string): Promise<string> {
  const user = await userRepo.findByEmail(email);

  // One generic message for both "no such email" and "wrong password" so the
  // response never reveals which accounts exist (user enumeration).
  const valid = bcrypt.compareSync(password, user?.password ?? DUMMY_PASSWORD_HASH);
  if (!user || !valid) {
    throw new AppError(401, 'Invalid email or password');
  }

  return createToken(user.id, user.sessionVersion);
}

// The user a session token signs in, or null when it is missing, invalid,
// expired or ended by a password change since it was made
export async function sessionUserId(token: string | null | undefined): Promise<number | null> {
  if (!token) return null;
  let payload: TokenPayload;
  try {
    payload = jwt.verify(token, config.jwt.secret) as TokenPayload;
  } catch {
    return null;
  }
  const version = await userRepo.getSessionVersion(payload.id);
  return version !== null && version === (payload.v ?? 0) ? payload.id : null;
}

// Sets a new password and ends every session of the account: their tokens are
// behind the new version and their notification sockets close. Returns a token
// at the new version, for the session that made a change to stay signed in
export async function setPassword(userId: number, newPassword: string): Promise<string> {
  const version = await userRepo.updatePassword(userId, bcrypt.hashSync(newPassword, BCRYPT_COST));
  closeUserSockets(userId);
  return createToken(userId, version);
}

export async function getUser(userId: number): Promise<AuthenticatedUser> {
  const user = await userRepo.findById(userId);
  if (!user) {
    throw new AppError(404, 'User not found');
  }
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
    showActivity: user.showActivity,
    showConnections: user.showConnections,
    onboardedAt: user.onboardedAt?.toISOString() ?? null,
    placementLevel: user.placementScore === null ? null : placementLevel(user.placementScore),
    interests: user.interestsAt ? (user.interests as Interest[]) : null,
    codeLanguage: isCodeLanguage(user.codeLanguage) ? user.codeLanguage : null,
  };
}

export async function forgotPassword(email: string, lang: EmailLang = 'en'): Promise<void> {
  const code = crypto.randomInt(100_000, 999_999).toString();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
  const found = await userRepo.setResetCode(email, code, expiresAt);
  if (!found) return;
  // Send outside the request path: keeps response timing for known vs unknown
  // emails close (no awaited email round-trip), and a mail-provider failure no
  // longer 500s the request or strands the reset code already stored in the DB.
  void emailService.sendResetCode(email, code, lang).catch((err) => {
    console.error('[forgot-password] failed to send reset code:', err);
  });
}

// Tries one reset code gets, from all IPs together; with three codes an hour
// per email (auth.routes.ts) an account faces at most 15 guesses an hour
const MAX_RESET_ATTEMPTS = 5;

export async function resetPassword(
  email: string,
  code: string,
  newPassword: string,
): Promise<void> {
  // Every try takes one, the right one too, so the right code after five
  // wrong ones is refused as well
  if (!(await userRepo.takeResetAttempt(email, MAX_RESET_ATTEMPTS))) {
    throw new AppError(400, 'This code has expired or used up its attempts, ask for a new one');
  }
  const user = await userRepo.findByResetCode(email, code);
  if (!user) {
    throw new AppError(400, 'Invalid or expired code');
  }
  await setPassword(user.id, newPassword);
}

function createToken(userId: number, version: number): string {
  return jwt.sign({ id: userId, v: version } satisfies TokenPayload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
}
