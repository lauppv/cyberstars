import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockPrisma = {
  user: {
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    findMany: vi.fn(),
    update: vi.fn(),
    updateMany: vi.fn(),
    create: vi.fn(),
    count: vi.fn(),
  },
  $transaction: vi.fn(),
};

vi.mock('../config/db.js', () => ({ prisma: mockPrisma }));

const repo = await import('./user.repository.js');
const { config } = await import('../config/index.js');

beforeEach(() => vi.clearAllMocks());

describe('findByEmail', () => {
  it('looks up a user by email', async () => {
    const user = { id: 1, email: 'a@b.com' };
    mockPrisma.user.findUnique.mockResolvedValue(user);
    const result = await repo.findByEmail('a@b.com');
    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { email: 'a@b.com' } });
    expect(result).toBe(user);
  });
});

describe('findById', () => {
  it('selects the public profile fields', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ id: 7 });
    const result = await repo.findById(7);
    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 7 } }),
    );
    expect(result).toEqual({ id: 7 });
  });
});

describe('findByIdWithPassword', () => {
  it('selects id and password only', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ id: 3, password: 'hash' });
    const result = await repo.findByIdWithPassword(3);
    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: 3 },
      select: { id: true, password: true },
    });
    expect(result).toEqual({ id: 3, password: 'hash' });
  });
});

describe('updateProfile', () => {
  it('updates the profile fields', async () => {
    mockPrisma.user.update.mockResolvedValue({});
    await repo.updateProfile(5, { bio: 'hi' });
    expect(mockPrisma.user.update).toHaveBeenCalledWith({ where: { id: 5 }, data: { bio: 'hi' } });
  });
});

describe('getRole', () => {
  it('returns the stored role', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ role: 'ADMIN' });
    expect(await repo.getRole(1)).toBe('ADMIN');
  });

  it('defaults to USER when the user is missing', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    expect(await repo.getRole(1)).toBe('USER');
  });
});

describe('getTutorProfile', () => {
  it('returns the stored score and interests, or none for a missing user', async () => {
    mockPrisma.user.findUnique.mockResolvedValueOnce({ placementScore: 9, interests: ['c'] });
    mockPrisma.user.findUnique.mockResolvedValueOnce(null);
    expect(await repo.getTutorProfile(1)).toEqual({ placementScore: 9, interests: ['c'] });
    expect(await repo.getTutorProfile(1)).toEqual({ placementScore: null, interests: [] });
  });
});

describe('saveInterests', () => {
  it('stores the interests and when they were given', async () => {
    await repo.saveInterests(1, ['python', 'linux']);
    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { interests: ['python', 'linux'], interestsAt: expect.any(Date) },
    });
  });
});

describe('saveCodeLanguage', () => {
  it('stores the language picked last', async () => {
    await repo.saveCodeLanguage(1, 'c');
    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { codeLanguage: 'c' },
    });
  });
});

describe('create', () => {
  it('bootstraps the first account as ADMIN', async () => {
    const tx = {
      $executeRaw: vi.fn(),
      user: { count: vi.fn().mockResolvedValue(0), create: vi.fn().mockResolvedValue({ id: 1 }) },
    };
    mockPrisma.$transaction.mockImplementation((fn: (t: typeof tx) => unknown) => fn(tx));
    const id = await repo.create('Root', 'root@b.com', 'hash');
    expect(id).toBe(1);
    expect(tx.user.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ role: 'ADMIN' }) }),
    );
  });

  it('creates subsequent accounts as USER', async () => {
    const tx = {
      $executeRaw: vi.fn(),
      user: { count: vi.fn().mockResolvedValue(3), create: vi.fn().mockResolvedValue({ id: 9 }) },
    };
    mockPrisma.$transaction.mockImplementation((fn: (t: typeof tx) => unknown) => fn(tx));
    const id = await repo.create('Jane', 'jane@b.com', 'hash', 5);
    expect(id).toBe(9);
    expect(tx.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ role: 'USER', placementScore: 5 }),
      }),
    );
  });

  it('pins the FOUNDER_EMAIL account as FOUNDER regardless of order', async () => {
    Object.assign(config, { founderEmail: 'boss@b.com' });
    const tx = {
      $executeRaw: vi.fn(),
      user: { count: vi.fn().mockResolvedValue(5), create: vi.fn().mockResolvedValue({ id: 7 }) },
    };
    mockPrisma.$transaction.mockImplementation((fn: (t: typeof tx) => unknown) => fn(tx));
    const id = await repo.create('Boss', 'BOSS@b.com', 'hash');
    expect(id).toBe(7);
    expect(tx.user.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ role: 'FOUNDER' }) }),
    );
    Object.assign(config, { founderEmail: '' });
  });
});

describe('markOnboarded', () => {
  it('stamps the date only while it is still unset', async () => {
    mockPrisma.user.updateMany.mockResolvedValue({ count: 1 });
    await repo.markOnboarded(4);
    expect(mockPrisma.user.updateMany).toHaveBeenCalledWith({
      where: { id: 4, onboardedAt: null },
      data: { onboardedAt: expect.any(Date) },
    });
  });
});

describe('updateRole', () => {
  it('updates the role', async () => {
    mockPrisma.user.update.mockResolvedValue({});
    await repo.updateRole(2, 'ADMIN');
    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: 2 },
      data: { role: 'ADMIN' },
    });
  });
});

describe('countByRole', () => {
  it('counts users with the given role', async () => {
    mockPrisma.user.count.mockResolvedValue(3);
    const n = await repo.countByRole('ADMIN');
    expect(n).toBe(3);
    expect(mockPrisma.user.count).toHaveBeenCalledWith({ where: { role: 'ADMIN' } });
  });
});

describe('getAdminIds', () => {
  it('returns the ids of all admins and the founder', async () => {
    mockPrisma.user.findMany.mockResolvedValue([{ id: 1 }, { id: 4 }]);
    const ids = await repo.getAdminIds();
    expect(ids).toEqual([1, 4]);
    expect(mockPrisma.user.findMany).toHaveBeenCalledWith({
      where: { role: { in: ['ADMIN', 'FOUNDER'] } },
      select: { id: true },
    });
  });
});

describe('setResetCode', () => {
  it('returns false when the email is unknown', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    expect(await repo.setResetCode('x@b.com', '123456', new Date())).toBe(false);
    expect(mockPrisma.user.update).not.toHaveBeenCalled();
  });

  it('stores the code and returns true when the user exists', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ id: 1 });
    mockPrisma.user.update.mockResolvedValue({});
    const expires = new Date();
    expect(await repo.setResetCode('a@b.com', '123456', expires)).toBe(true);
    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { email: 'a@b.com' },
      data: { resetCode: '123456', resetCodeExpiresAt: expires, resetCodeAttempts: 0 },
    });
  });
});

describe('takeResetAttempt', () => {
  it('takes a try of a live code with tries left in one update', async () => {
    mockPrisma.user.updateMany.mockResolvedValue({ count: 1 });
    expect(await repo.takeResetAttempt('a@b.com', 5)).toBe(true);
    expect(mockPrisma.user.updateMany).toHaveBeenCalledWith({
      where: {
        email: 'a@b.com',
        resetCode: { not: null },
        resetCodeExpiresAt: { gte: expect.any(Date) },
        resetCodeAttempts: { lt: 5 },
      },
      data: { resetCodeAttempts: { increment: 1 } },
    });
  });

  it('returns false when no code matched', async () => {
    mockPrisma.user.updateMany.mockResolvedValue({ count: 0 });
    expect(await repo.takeResetAttempt('a@b.com', 5)).toBe(false);
  });
});

describe('findByResetCode', () => {
  it('queries by email, code, and unexpired window', async () => {
    mockPrisma.user.findFirst.mockResolvedValue({ id: 1 });
    const result = await repo.findByResetCode('a@b.com', '123456');
    expect(mockPrisma.user.findFirst).toHaveBeenCalledWith({
      where: expect.objectContaining({ email: 'a@b.com', resetCode: '123456' }),
    });
    expect(result).toEqual({ id: 1 });
  });
});

describe('updatePassword', () => {
  it('sets the password, clears the reset code and raises the session version', async () => {
    mockPrisma.user.update.mockResolvedValue({ sessionVersion: 3 });
    expect(await repo.updatePassword(4, 'newhash')).toBe(3);
    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: 4 },
      data: {
        password: 'newhash',
        resetCode: null,
        resetCodeExpiresAt: null,
        sessionVersion: { increment: 1 },
      },
      select: { sessionVersion: true },
    });
  });
});

describe('getSessionVersion', () => {
  it("reads the account's session version", async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ sessionVersion: 2 });
    expect(await repo.getSessionVersion(4)).toBe(2);
    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: 4 },
      select: { sessionVersion: true },
    });
  });

  it('returns null for an account that is gone', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    expect(await repo.getSessionVersion(4)).toBeNull();
  });
});

describe('setPendingEmailChange', () => {
  it('stores the pending email and code', async () => {
    mockPrisma.user.update.mockResolvedValue({});
    const expires = new Date();
    await repo.setPendingEmailChange(1, 'new@b.com', '654321', expires);
    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: {
        pendingEmail: 'new@b.com',
        emailChangeCode: '654321',
        emailChangeCodeExpiresAt: expires,
      },
    });
  });
});

describe('findPendingEmailChange', () => {
  it('returns null when no pending change is set', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ pendingEmail: null });
    expect(await repo.findPendingEmailChange(1)).toBeNull();
  });

  it('returns the pending change fields when present', async () => {
    const expires = new Date();
    mockPrisma.user.findUnique.mockResolvedValue({
      pendingEmail: 'new@b.com',
      emailChangeCode: '654321',
      emailChangeCodeExpiresAt: expires,
    });
    expect(await repo.findPendingEmailChange(1)).toEqual({
      pendingEmail: 'new@b.com',
      emailChangeCode: '654321',
      emailChangeCodeExpiresAt: expires,
    });
  });
});

describe('applyPendingEmailChange', () => {
  it('swaps the email and clears the change fields', async () => {
    mockPrisma.user.update.mockResolvedValue({});
    await repo.applyPendingEmailChange(1, 'new@b.com');
    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: {
        email: 'new@b.com',
        pendingEmail: null,
        emailChangeCode: null,
        emailChangeCodeExpiresAt: null,
      },
    });
  });
});

describe('clearPendingEmailChange', () => {
  it('clears the pending change fields', async () => {
    mockPrisma.user.update.mockResolvedValue({});
    await repo.clearPendingEmailChange(1);
    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { pendingEmail: null, emailChangeCode: null, emailChangeCodeExpiresAt: null },
    });
  });
});
