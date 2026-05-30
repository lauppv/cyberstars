import { describe, it, expect, vi, beforeEach } from 'vitest';
import jwt from 'jsonwebtoken';
import { AppError } from '../middleware/errorHandler.js';

process.env.JWT_SECRET = 'test-secret';
process.env.DB_USER = 'test';
process.env.DB_HOST = 'localhost';
process.env.DB_NAME = 'test';
process.env.DB_PASSWORD = 'test';

const mockUserRepo = {
  create: vi.fn(),
  findByEmail: vi.fn(),
  findById: vi.fn(),
  setResetCode: vi.fn(),
  findByResetCode: vi.fn(),
  updatePassword: vi.fn(),
};

const mockSendResetCode = vi.fn();

vi.mock('../repositories/user.repository.js', () => mockUserRepo);
vi.mock('./email.service.js', () => ({
  sendResetCode: (...args: unknown[]) => mockSendResetCode(...args),
}));

const { signup, login, getUser, forgotPassword, resetPassword } = await import('./auth.service.js');

beforeEach(() => vi.clearAllMocks());

describe('signup', () => {
  it('returns a valid JWT on success', async () => {
    mockUserRepo.create.mockResolvedValue(42);
    const token = await signup('Alice', 'alice@test.com', 'pass123');
    const payload = jwt.verify(token, 'test-secret') as { id: number };
    expect(payload.id).toBe(42);
  });

  it('throws 409 on duplicate email (Prisma P2002)', async () => {
    mockUserRepo.create.mockRejectedValue({ code: 'P2002' });
    await expect(signup('Alice', 'alice@test.com', 'pass123')).rejects.toThrow(AppError);
    try {
      await signup('Alice', 'alice@test.com', 'pass123');
    } catch (e) {
      expect((e as AppError).statusCode).toBe(409);
    }
  });

  it('re-throws unknown errors', async () => {
    mockUserRepo.create.mockRejectedValue(new Error('DB down'));
    await expect(signup('Alice', 'alice@test.com', 'pass123')).rejects.toThrow('DB down');
  });
});

describe('login', () => {
  it('returns a JWT for valid credentials', async () => {
    const bcrypt = await import('bcryptjs');
    mockUserRepo.findByEmail.mockResolvedValue({
      id: 7,
      password: bcrypt.hashSync('correct', 8),
    });
    const token = await login('bob@test.com', 'correct');
    const payload = jwt.verify(token, 'test-secret') as { id: number };
    expect(payload.id).toBe(7);
  });

  it('throws a generic 401 for unknown email (no enumeration)', async () => {
    mockUserRepo.findByEmail.mockResolvedValue(null);
    await expect(login('nobody@test.com', 'pass')).rejects.toThrow('Invalid email or password');
  });

  it('throws the same generic 401 for wrong password', async () => {
    const bcrypt = await import('bcryptjs');
    mockUserRepo.findByEmail.mockResolvedValue({
      id: 7,
      password: bcrypt.hashSync('correct', 8),
    });
    await expect(login('bob@test.com', 'wrong')).rejects.toThrow('Invalid email or password');
  });
});

describe('getUser', () => {
  it('returns user data with active status', async () => {
    const future = new Date(Date.now() + 60_000);
    mockUserRepo.findById.mockResolvedValue({
      id: 1,
      name: 'Ada',
      email: 'ada@test.com',
      role: 'USER',
      avatarUrl: null,
      bio: 'hello',
      status: 'coding',
      statusExpiresAt: future,
    });
    const user = await getUser(1);
    expect(user.status).toBe('coding');
    expect(user.name).toBe('Ada');
  });

  it('nullifies expired status', async () => {
    const past = new Date(Date.now() - 60_000);
    mockUserRepo.findById.mockResolvedValue({
      id: 1,
      name: 'Ada',
      email: 'ada@test.com',
      role: 'USER',
      avatarUrl: null,
      bio: null,
      status: 'old status',
      statusExpiresAt: past,
    });
    const user = await getUser(1);
    expect(user.status).toBeNull();
    expect(user.statusExpiresAt).toBeNull();
  });

  it('throws 404 for missing user', async () => {
    mockUserRepo.findById.mockResolvedValue(null);
    await expect(getUser(999)).rejects.toThrow(AppError);
  });
});

describe('forgotPassword', () => {
  it('sends a reset code when user exists', async () => {
    mockUserRepo.setResetCode.mockResolvedValue(true);
    mockSendResetCode.mockResolvedValue(undefined);
    await forgotPassword('user@test.com');
    expect(mockUserRepo.setResetCode).toHaveBeenCalledWith(
      'user@test.com',
      expect.any(String),
      expect.any(Date),
    );
    expect(mockSendResetCode).toHaveBeenCalledWith('user@test.com', expect.any(String));
  });

  it('does not send email when user not found', async () => {
    mockUserRepo.setResetCode.mockResolvedValue(false);
    await forgotPassword('nobody@test.com');
    expect(mockSendResetCode).not.toHaveBeenCalled();
  });
});

describe('resetPassword', () => {
  it('resets password with valid code', async () => {
    mockUserRepo.findByResetCode.mockResolvedValue({ id: 5 });
    mockUserRepo.updatePassword.mockResolvedValue(undefined);
    await resetPassword('user@test.com', '123456', 'newpass');
    expect(mockUserRepo.updatePassword).toHaveBeenCalledWith(5, expect.any(String));
  });

  it('throws 400 for invalid or expired code', async () => {
    mockUserRepo.findByResetCode.mockResolvedValue(null);
    await expect(resetPassword('user@test.com', '000000', 'newpass')).rejects.toThrow(AppError);
  });
});
