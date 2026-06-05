import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';

process.env.JWT_SECRET = 'test-secret';
process.env.DB_USER = 'test';
process.env.DB_HOST = 'localhost';
process.env.DB_NAME = 'test';
process.env.DB_PASSWORD = 'test';

function makePrismaProxy() {
  return new Proxy(
    {},
    {
      get() {
        return new Proxy(() => {}, {
          get() {
            return () => Promise.resolve([]);
          },
          apply() {
            return Promise.resolve([]);
          },
        });
      },
    },
  );
}

vi.mock('@prisma/client', () => ({
  PrismaClient: class {
    constructor() {
      return makePrismaProxy();
    }
  },
}));
vi.mock('../config/db.js', () => ({ prisma: makePrismaProxy() }));

const mockUserRepo = {
  findByEmail: vi.fn().mockResolvedValue(null),
  findById: vi.fn().mockResolvedValue(null),
  create: vi.fn().mockResolvedValue(null),
  updateProfile: vi.fn().mockResolvedValue(null),
  getRole: vi.fn().mockResolvedValue('USER'),
  updateRole: vi.fn().mockResolvedValue(undefined),
};
vi.mock('../repositories/user.repository.js', () => mockUserRepo);
vi.mock('../repositories/curriculum.repository.js', () => ({
  getLessonsByCourse: vi.fn().mockResolvedValue([]),
  getLessonCount: vi.fn().mockResolvedValue(0),
}));
vi.mock('../repositories/progress.repository.js', () => ({
  getProgress: vi.fn().mockResolvedValue([]),
  markComplete: vi.fn().mockResolvedValue(null),
  getSavedCode: vi.fn().mockResolvedValue(null),
  saveCode: vi.fn().mockResolvedValue(null),
  trackAccess: vi.fn().mockResolvedValue(null),
}));

vi.mock('file-type', () => ({
  fileTypeFromBuffer: vi.fn().mockResolvedValue({ mime: 'image/png', ext: 'png' }),
}));

const { app } = await import('../app.js');
const { fileTypeFromBuffer } = await import('file-type');
const mockFileType = vi.mocked(fileTypeFromBuffer);

const token = jwt.sign({ id: 1 }, 'test-secret');

beforeEach(() => vi.clearAllMocks());

describe('PATCH /api/profile', () => {
  it('returns 401 without token', async () => {
    const res = await request(app).patch('/api/profile');
    expect(res.status).toBe(401);
  });

  it('updates bio', async () => {
    const res = await request(app)
      .patch('/api/profile')
      .set('Cookie', `token=${token}`)
      .send({ bio: 'Hello world' });

    expect(res.status).toBe(200);
    expect(mockUserRepo.updateProfile).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ bio: 'Hello world' }),
    );
  });

  it('clears bio when empty string', async () => {
    const res = await request(app)
      .patch('/api/profile')
      .set('Cookie', `token=${token}`)
      .send({ bio: '' });

    expect(res.status).toBe(200);
    expect(mockUserRepo.updateProfile).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ bio: null }),
    );
  });

  it('sets status with 24h expiry', async () => {
    const before = Date.now();
    const res = await request(app)
      .patch('/api/profile')
      .set('Cookie', `token=${token}`)
      .send({ status: 'Coding' });

    expect(res.status).toBe(200);
    const call = mockUserRepo.updateProfile.mock.calls[0];
    expect(call[1].status).toBe('Coding');
    expect(call[1].statusExpiresAt.getTime()).toBeGreaterThanOrEqual(
      before + 24 * 60 * 60 * 1000 - 1000,
    );
  });

  it('truncates bio at 200 chars', async () => {
    const res = await request(app)
      .patch('/api/profile')
      .set('Cookie', `token=${token}`)
      .send({ bio: 'x'.repeat(300) });

    expect(res.status).toBe(200);
    expect(mockUserRepo.updateProfile.mock.calls[0][1].bio).toHaveLength(200);
  });

  it('clears status and expiresAt when status is empty string', async () => {
    const res = await request(app)
      .patch('/api/profile')
      .set('Cookie', `token=${token}`)
      .send({ status: '' });

    expect(res.status).toBe(200);
    const call = mockUserRepo.updateProfile.mock.calls[0];
    expect(call[1].status).toBeNull();
    expect(call[1].statusExpiresAt).toBeNull();
  });

  it('forwards repository errors to the error handler', async () => {
    mockUserRepo.updateProfile.mockRejectedValueOnce(new Error('DB down'));
    const res = await request(app)
      .patch('/api/profile')
      .set('Cookie', `token=${token}`)
      .send({ bio: 'hi' });

    expect(res.status).toBe(500);
  });
});

describe('POST /api/profile/avatar', () => {
  it('returns 401 without token', async () => {
    const res = await request(app).post('/api/profile/avatar');
    expect(res.status).toBe(401);
  });

  it('uploads avatar successfully', async () => {
    mockFileType.mockResolvedValue({ mime: 'image/png', ext: 'png' } as never);
    mockUserRepo.findById.mockResolvedValue({ avatarUrl: null });

    const res = await request(app)
      .post('/api/profile/avatar')
      .set('Cookie', `token=${token}`)
      .attach('avatar', Buffer.from('fakepng'), 'test.png');

    expect(res.status).toBe(200);
    expect(res.body.avatarUrl).toMatch(/^\/uploads\/avatars\/1-\d+\.png$/);
    expect(mockUserRepo.updateProfile).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ avatarUrl: expect.stringContaining('/uploads/avatars/') }),
    );
  });

  it('rejects invalid file type', async () => {
    mockFileType.mockResolvedValue({ mime: 'application/pdf', ext: 'pdf' } as never);

    const res = await request(app)
      .post('/api/profile/avatar')
      .set('Cookie', `token=${token}`)
      .attach('avatar', Buffer.from('fakepdf'), 'test.pdf');

    expect(res.status).toBe(400);
  });

  it('replaces existing avatar when user already has one', async () => {
    mockFileType.mockResolvedValue({ mime: 'image/png', ext: 'png' } as never);
    mockUserRepo.findById.mockResolvedValue({ avatarUrl: '/uploads/avatars/old.png' });

    const res = await request(app)
      .post('/api/profile/avatar')
      .set('Cookie', `token=${token}`)
      .attach('avatar', Buffer.from('fakepng'), 'test.png');

    expect(res.status).toBe(200);
    expect(mockUserRepo.updateProfile).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ avatarUrl: expect.stringContaining('/uploads/avatars/') }),
    );
  });
});

describe('DELETE /api/profile/avatar', () => {
  it('returns 401 without token', async () => {
    const res = await request(app).delete('/api/profile/avatar');
    expect(res.status).toBe(401);
  });

  it('removes avatar', async () => {
    mockUserRepo.findById.mockResolvedValue({ avatarUrl: '/uploads/avatars/old.png' });

    const res = await request(app).delete('/api/profile/avatar').set('Cookie', `token=${token}`);

    expect(res.status).toBe(200);
    expect(mockUserRepo.updateProfile).toHaveBeenCalledWith(1, { avatarUrl: null });
  });
});
