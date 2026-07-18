import { prisma } from '../config/db.js';
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
  },
) {
  await prisma.user.update({ where: { id }, data });
}

export async function getRole(id: number): Promise<Role> {
  const user = await prisma.user.findUnique({ where: { id }, select: { role: true } });
  return user?.role ?? 'USER';
}

export async function create(name: string, email: string, hashedPassword: string): Promise<number> {
  // The very first account to register bootstraps the platform as ADMIN.
  // Serialize the count+create with an advisory lock so two concurrent first
  // signups against an empty DB cannot both see count === 0 and both become ADMIN.
  return prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(4242)`;
    const existing = await tx.user.count();
    const user = await tx.user.create({
      data: { name, email, password: hashedPassword, role: existing === 0 ? 'ADMIN' : 'USER' },
      select: { id: true },
    });
    return user.id;
  });
}

export async function updateRole(id: number, role: Role): Promise<void> {
  await prisma.user.update({ where: { id }, data: { role } });
}

export async function countByRole(role: Role): Promise<number> {
  return prisma.user.count({ where: { role } });
}

export async function getAdminIds(): Promise<number[]> {
  const admins = await prisma.user.findMany({ where: { role: 'ADMIN' }, select: { id: true } });
  return admins.map((u) => u.id);
}

export async function setResetCode(email: string, code: string, expiresAt: Date): Promise<boolean> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return false;
  await prisma.user.update({
    where: { email },
    data: { resetCode: code, resetCodeExpiresAt: expiresAt },
  });
  return true;
}

export async function findByResetCode(email: string, code: string): Promise<User | null> {
  return prisma.user.findFirst({
    where: { email, resetCode: code, resetCodeExpiresAt: { gte: new Date() } },
  });
}

export async function updatePassword(id: number, hashedPassword: string): Promise<void> {
  await prisma.user.update({
    where: { id },
    data: { password: hashedPassword, resetCode: null, resetCodeExpiresAt: null },
  });
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
