import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import * as userRepo from '../repositories/user.repository.js';
import * as emailService from './email.service.js';
import type { TokenPayload, AuthenticatedUser } from '../../shared/auth.js';
import { AppError } from '../middleware/errorHandler.js';

export async function signup(name: string, email: string, password: string): Promise<string> {
  const hashedPassword = bcrypt.hashSync(password, 8);
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

export async function login(email: string, password: string): Promise<string> {
  const user = await userRepo.findByEmail(email);
  if (!user) {
    throw new AppError(401, 'User not found');
  }

  const valid = bcrypt.compareSync(password, user.password);
  if (!valid) {
    throw new AppError(401, 'Invalid password');
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
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatarUrl: user.avatarUrl,
    bio: user.bio,
    status: statusExpired ? null : user.status,
    statusExpiresAt: statusExpired ? null : (user.statusExpiresAt?.toISOString() ?? null),
  };
}

export async function forgotPassword(email: string): Promise<void> {
  const code = crypto.randomInt(100_000, 999_999).toString();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
  const found = await userRepo.setResetCode(email, code, expiresAt);
  if (!found) return;
  await emailService.sendResetCode(email, code);
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
  const hashed = bcrypt.hashSync(newPassword, 8);
  await userRepo.updatePassword(user.id, hashed);
}

function createToken(userId: number): string {
  return jwt.sign({ id: userId } satisfies TokenPayload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
}
