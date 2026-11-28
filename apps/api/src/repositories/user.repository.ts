import { prisma } from '../config/db.js';
import { config } from '../config/index.js';
import type { Prisma, User, Role } from '@prisma/client';

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
      emailConfirmedAt: true,
      confirmTokenHash: true,
      createdAt: true,
      showBio: true,
      showStats: true,
      showProgress: true,
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
    showConnections?: boolean;
  },
) {
  await prisma.user.update({ where: { id }, data });
}

// The account's role, null when the account is gone
export async function findRole(id: number): Promise<Role | null> {
  const user = await prisma.user.findUnique({ where: { id }, select: { role: true } });
  return user?.role ?? null;
}

export async function getRole(id: number): Promise<Role> {
  return (await findRole(id)) ?? 'USER';
}

// The test accounts we made ourselves, told apart by their email's domain
export const BOT_EMAIL_ENDINGS = ['@fake.com', '.fake.com', '@bots.cyberstars.app'];

export async function isBot(id: number): Promise<boolean> {
  const found = await prisma.user.count({
    where: { id, OR: BOT_EMAIL_ENDINGS.map((endsWith) => ({ email: { endsWith } })) },
  });
  return found > 0;
}

// The accounts the admin page counts: students, never moderators, admins, the
// founder or our test accounts
export const PEOPLE: Prisma.UserWhereInput = {
  role: 'USER',
  NOT: { OR: BOT_EMAIL_ENDINGS.map((endsWith) => ({ email: { endsWith } })) },
};

export async function isPerson(id: number): Promise<boolean> {
  return (await prisma.user.count({ where: { id, ...PEOPLE } })) > 0;
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
  // The very first account to register bootstraps as ADMIN. The founder's role
  // waits for a confirmed email (founderRole), since anyone can type an
  // address at sign-up. Serialize the count+create with an advisory lock so two
  // concurrent first signups against an empty DB cannot both see count === 0
  // and both become ADMIN.
  return prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(4242)`;
    const existing = await tx.user.count();
    const role: Role = existing === 0 ? 'ADMIN' : 'USER';
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

// The account's sessions end apart from this (auth.setPassword)
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
// between the uniqueness check and the update. The code reached the new
// inbox, so the new email is confirmed, and a link sent to the old one stops
// working.
export async function applyPendingEmailChange(id: number, newEmail: string): Promise<void> {
  await prisma.user.update({
    where: { id },
    data: {
      email: newEmail,
      pendingEmail: null,
      emailChangeCode: null,
      emailChangeCodeExpiresAt: null,
      ...confirmedNow(newEmail),
    },
  });
}

// The founder's role, for an email just proven to be the account's: the one
// FOUNDER_EMAIL names, compared lowercase like every email
function founderRole(email: string): { role?: Role } {
  const founderEmail = config.founderEmail.trim().toLowerCase();
  return founderEmail && email === founderEmail ? { role: 'FOUNDER' } : {};
}

// What confirming an email writes: when, no link waiting, and the founder's
// role when it is the founder's email
function confirmedNow(email: string) {
  return {
    emailConfirmedAt: new Date(),
    confirmTokenHash: null,
    confirmTokenExpiresAt: null,
    ...founderRole(email),
  };
}

// A new confirmation link replaces the one before, which stops working
export async function setConfirmToken(
  id: number,
  tokenHash: string,
  expiresAt: Date,
): Promise<void> {
  await prisma.user.update({
    where: { id },
    data: { confirmTokenHash: tokenHash, confirmTokenExpiresAt: expiresAt },
  });
}

// Confirms the email of the account whose live link this is; null when no live
// link has this hash. The write matches the hash again, so two clicks at once
// confirm once
export async function confirmEmail(tokenHash: string): Promise<number | null> {
  const user = await prisma.user.findFirst({
    where: { confirmTokenHash: tokenHash, confirmTokenExpiresAt: { gte: new Date() } },
    select: { id: true, email: true },
  });
  if (!user) return null;
  const { count } = await prisma.user.updateMany({
    where: { id: user.id, email: user.email, confirmTokenHash: tokenHash },
    data: confirmedNow(user.email),
  });
  return count ? user.id : null;
}

// A reset code reached the inbox, which proves the email as a link would
export async function markEmailConfirmed(id: number): Promise<void> {
  const user = await prisma.user.findUnique({ where: { id }, select: { email: true } });
  if (!user) return;
  await prisma.user.updateMany({
    where: { id, email: user.email },
    data: confirmedNow(user.email),
  });
}

// The account's email while it waits to be confirmed, null once it is
export async function unconfirmedEmail(id: number): Promise<string | null> {
  const user = await prisma.user.findUnique({
    where: { id },
    select: { email: true, emailConfirmedAt: true },
  });
  return user && !user.emailConfirmedAt ? user.email : null;
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
