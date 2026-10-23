import { prisma } from '../config/db.js';
import { config } from '../config/index.js';
import type { User, Role } from '@prisma/client';

export async function findByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { email } });
}

export async function findById(id: number) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatarUrl: true,
      bio: true,
      status: true,
      statusExpiresAt: true,
      pendingEmail: true,
      emailChangeCodeExpiresAt: true,
      createdAt: true,
      showBio: true,
      showStats: true,
      showProgress: true,
      showActivity: true,
      showConnections: true,
      onboardedAt: true,
      placementScore: true,
      interests: true,
      interestsAt: true,
      codeLanguage: true,
    },
  });
}

export async function findByIdWithPassword(
  id: number,
): Promise<{ id: number; password: string } | null> {
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, password: true },
  });
}

export async function updateProfile(
  id: number,
  data: {
    bio?: string | null;
    status?: string | null;
    statusExpiresAt?: Date | null;
    avatarUrl?: string | null;
    showBio?: boolean;
    showStats?: boolean;
    showProgress?: boolean;
    showActivity?: boolean;
    showConnections?: boolean;
  },
) {
  await prisma.user.update({ where: { id }, data });
}

export async function getRole(id: number): Promise<Role> {
  const user = await prisma.user.findUnique({ where: { id }, select: { role: true } });
  return user?.role ?? 'USER';
}

// What the tutor goes by about the student, besides their progress
export async function getTutorProfile(
  id: number,
): Promise<{ placementScore: number | null; interests: string[] }> {
  const user = await prisma.user.findUnique({
    where: { id },
    select: { placementScore: true, interests: true },
  });
  return { placementScore: user?.placementScore ?? null, interests: user?.interests ?? [] };
}

export async function create(
  name: string,
  email: string,
  hashedPassword: string,
  placementScore?: number,
): Promise<number> {
  // The account matching FOUNDER_EMAIL always bootstraps as FOUNDER (unique
  // owner). Otherwise the very first account to register bootstraps as ADMIN.
  // Serialize the count+create with an advisory lock so two concurrent first
  // signups against an empty DB cannot both see count === 0 and both become ADMIN.
  const founderEmail = config.founderEmail.toLowerCase();
  return prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(4242)`;
    const existing = await tx.user.count();
    const role: Role =
      founderEmail && email.toLowerCase() === founderEmail
        ? 'FOUNDER'
        : existing === 0
          ? 'ADMIN'
          : 'USER';
    const user = await tx.user.create({
      data: { name, email, password: hashedPassword, role, placementScore },
      select: { id: true },
    });
    return user.id;
  });
}

export async function saveInterests(id: number, interests: string[]): Promise<void> {
  await prisma.user.update({ where: { id }, data: { interests, interestsAt: new Date() } });
}

export async function saveCodeLanguage(id: number, codeLanguage: string): Promise<void> {
  await prisma.user.update({ where: { id }, data: { codeLanguage } });
}

// Only the first passing run stamps the date; later passes leave it alone.
export async function markOnboarded(id: number): Promise<void> {
  await prisma.user.updateMany({
    where: { id, onboardedAt: null },
    data: { onboardedAt: new Date() },
  });
}

export async function updateRole(id: number, role: Role): Promise<void> {
  await prisma.user.update({ where: { id }, data: { role } });
}

export async function countByRole(role: Role): Promise<number> {
  return prisma.user.count({ where: { role } });
}

export async function getAdminIds(): Promise<number[]> {
  const admins = await prisma.user.findMany({
    where: { role: { in: ['ADMIN', 'FOUNDER'] } },
    select: { id: true },
  });
  return admins.map((u) => u.id);
}

export async function setResetCode(email: string, code: string, expiresAt: Date): Promise<boolean> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return false;
  await prisma.user.update({
    where: { email },
    data: { resetCode: code, resetCodeExpiresAt: expiresAt, resetCodeAttempts: 0 },
  });
  return true;
}

// Takes one of the live reset code's tries in a single UPDATE, so guesses sent
// at once from many IPs can't all read the same count; false when the code
// expired, has no tries left, or the email has none
export async function takeResetAttempt(email: string, maxAttempts: number): Promise<boolean> {
  const { count } = await prisma.user.updateMany({
    where: {
      email,
      resetCode: { not: null },
      resetCodeExpiresAt: { gte: new Date() },
      resetCodeAttempts: { lt: maxAttempts },
    },
    data: { resetCodeAttempts: { increment: 1 } },
  });
  return count > 0;
}

export async function findByResetCode(email: string, code: string): Promise<User | null> {
  return prisma.user.findFirst({
    where: { email, resetCode: code, resetCodeExpiresAt: { gte: new Date() } },
  });
}

// Also raises the session version, which ends every token made before; returns
// the new one
export async function updatePassword(id: number, hashedPassword: string): Promise<number> {
  const { sessionVersion } = await prisma.user.update({
    where: { id },
    data: {
      password: hashedPassword,
      resetCode: null,
      resetCodeExpiresAt: null,
      sessionVersion: { increment: 1 },
    },
    select: { sessionVersion: true },
  });
  return sessionVersion;
}

export async function getSessionVersion(id: number): Promise<number | null> {
  const user = await prisma.user.findUnique({ where: { id }, select: { sessionVersion: true } });
  return user?.sessionVersion ?? null;
}

export async function setPendingEmailChange(
  id: number,
  pendingEmail: string,
  code: string,
  expiresAt: Date,
): Promise<void> {
  await prisma.user.update({
    where: { id },
    data: {
      pendingEmail,
      emailChangeCode: code,
      emailChangeCodeExpiresAt: expiresAt,
    },
  });
}

export async function findPendingEmailChange(id: number): Promise<{
  pendingEmail: string;
  emailChangeCode: string;
  emailChangeCodeExpiresAt: Date;
} | null> {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      pendingEmail: true,
      emailChangeCode: true,
      emailChangeCodeExpiresAt: true,
    },
  });
  if (!user?.pendingEmail || !user.emailChangeCode || !user.emailChangeCodeExpiresAt) return null;
  return {
    pendingEmail: user.pendingEmail,
    emailChangeCode: user.emailChangeCode,
    emailChangeCodeExpiresAt: user.emailChangeCodeExpiresAt,
  };
}

// Swap the account's email to pendingEmail and clear the change fields in a
// single transaction so a concurrent signup on the same address can't slip in
// between the uniqueness check and the update.
export async function applyPendingEmailChange(id: number, newEmail: string): Promise<void> {
  await prisma.user.update({
    where: { id },
    data: {
      email: newEmail,
      pendingEmail: null,
      emailChangeCode: null,
      emailChangeCodeExpiresAt: null,
    },
  });
}

export async function clearPendingEmailChange(id: number): Promise<void> {
  await prisma.user.update({
    where: { id },
    data: {
      pendingEmail: null,
      emailChangeCode: null,
      emailChangeCodeExpiresAt: null,
    },
  });
}
