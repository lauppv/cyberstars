import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockPrisma = {
  user: {
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    update: vi.fn(),
    create: vi.fn(),
    count: vi.fn(),
  },
  $transaction: vi.fn(),
};

vi.mock('../config/db.js', () => ({ prisma: mockPrisma }));

const repo = await import('./user.repository.js');

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
    const id = await repo.create('Jane', 'jane@b.com', 'hash');
    expect(id).toBe(9);
    expect(tx.user.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ role: 'USER' }) }),
    );
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
      data: { resetCode: '123456', resetCodeExpiresAt: expires },
    });
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
  it('sets the password and clears the reset code', async () => {
    mockPrisma.user.update.mockResolvedValue({});
    await repo.updatePassword(4, 'newhash');
    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: 4 },
      data: { password: 'newhash', resetCode: null, resetCodeExpiresAt: null },
    });
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
