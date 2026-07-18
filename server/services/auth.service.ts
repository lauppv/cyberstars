import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import * as userRepo from '../repositories/user.repository.js';
import * as emailService from './email.service.js';
import type { TokenPayload, AuthenticatedUser } from '../../shared/auth.js';
import { AppError } from '../middleware/errorHandler.js';

// Kept in one place because the dummy-hash timing defense below only works if
// every hash (real and throwaway) uses the same cost.
const BCRYPT_COST = 10;

export async function signup(name: string, email: string, password: string): Promise<string> {
  const hashedPassword = bcrypt.hashSync(password, BCRYPT_COST);
  try {
    const userId = await userRepo.create(name, email, hashedPassword);
    return createToken(userId);
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

  return createToken(user.id);
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
  };
}

export async function forgotPassword(email: string): Promise<void> {
  const code = crypto.randomInt(100_000, 999_999).toString();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
  const found = await userRepo.setResetCode(email, code, expiresAt);
  if (!found) return;
  // Send outside the request path: keeps response timing for known vs unknown
  // emails close (no awaited email round-trip), and a mail-provider failure no
  // longer 500s the request or strands the reset code already stored in the DB.
  void emailService.sendResetCode(email, code).catch((err) => {
    console.error('[forgot-password] failed to send reset code:', err);
  });
}

export async function resetPassword(
  email: string,
  code: string,
  newPassword: string,
): Promise<void> {
  const user = await userRepo.findByResetCode(email, code);
  if (!user) {
    throw new AppError(400, 'Invalid or expired code');
  }
  const hashed = bcrypt.hashSync(newPassword, BCRYPT_COST);
  await userRepo.updatePassword(user.id, hashed);
}

function createToken(userId: number): string {
  return jwt.sign({ id: userId } satisfies TokenPayload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
}
