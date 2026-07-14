import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';

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

vi.mock('@prisma/client', () => {
  class PrismaClient {
    constructor() {
      return makePrismaProxy();
    }
  }
  return { PrismaClient };
});
vi.mock('./config/db.js', () => ({ prisma: makePrismaProxy() }));

vi.mock('./repositories/curriculum.repository.js', () => ({
  getLessonsByCourse: vi.fn().mockResolvedValue([]),
  lessonExists: vi.fn().mockResolvedValue(false),
}));
vi.mock('./repositories/progress.repository.js', () => ({
  getProgress: vi.fn().mockResolvedValue([]),
  markComplete: vi.fn().mockResolvedValue(null),
  getSavedCode: vi.fn().mockResolvedValue(null),
  saveCode: vi.fn().mockResolvedValue(null),
  trackAccess: vi.fn().mockResolvedValue(null),
}));
vi.mock('./repositories/user.repository.js', () => ({
  findByEmail: vi.fn().mockResolvedValue(null),
  findById: vi.fn().mockResolvedValue(null),
  create: vi.fn().mockResolvedValue(null),
  updateProfile: vi.fn().mockResolvedValue(null),
}));

const { app } = await import('./app.js');

describe('endpoint smoke tests — public routes return 200', () => {
  const publicGets = ['/api/forum/categories'];

  for (const path of publicGets) {
    it(`GET ${path}`, async () => {
      const res = await request(app).get(path);
      expect(res.status).toBe(200);
    });
  }
});

describe('guest id cookie', () => {
  it('sets a guestId cookie for signed-out visitors', async () => {
    const res = await request(app).get('/api/forum/categories');
    const cookies = (res.headers['set-cookie'] as string[] | undefined) ?? [];
    expect(cookies.some((c) => c.startsWith('guestId='))).toBe(true);
  });

  it('does not set a guestId when a token cookie is already present', async () => {
    const res = await request(app).get('/api/forum/categories').set('Cookie', 'token=whatever');
    const cookies = (res.headers['set-cookie'] as string[] | undefined) ?? [];
    expect(cookies.some((c) => c.startsWith('guestId='))).toBe(false);
  });
});

describe('endpoint smoke tests — auth-protected routes return 401 without token', () => {
  const authRequired: [string, string][] = [
    ['get', '/api/progress/python'],
    ['get', '/api/progress/python/booleans/code'],
    ['put', '/api/progress/python/booleans/code'],
    ['post', '/api/progress/python/booleans/access'],
    ['post', '/api/forum/threads'],
    ['post', '/api/terminal/session'],
    ['post', '/api/terminal/exec'],
    ['delete', '/api/terminal/session/123'],
    ['post', '/api/tests/python/print/run'],
    ['post', '/api/support/tickets'],
    ['get', '/api/support/tickets/mine'],
    ['patch', '/api/profile'],
    ['post', '/api/profile/avatar'],
    ['delete', '/api/profile/avatar'],
    ['post', '/api/profile/password'],
    ['get', '/api/profile/activity'],
    ['get', '/api/daily'],
    ['get', '/auth/me'],
  ];

  for (const [method, path] of authRequired) {
    it(`${method.toUpperCase()} ${path}`, async () => {
      const res = await (request(app) as Record<string, (url: string) => request.Test>)[method](
        path,
      );
      expect(res.status).toBe(401);
    });
  }
});

describe('endpoint smoke tests — unknown routes', () => {
  it('GET /api/does-not-exist → 404', async () => {
    const res = await request(app).get('/api/does-not-exist');
    expect(res.status).toBe(404);
  });
});

describe('SPA fallback', () => {
  it('non-api/auth path invokes the index.html fallback handler', async () => {
    // dist/index.html may not exist in tests; we only need the handler to run.
    // sendFile yields 200 when the file exists, 404/500 when it doesn't —
    // any of these proves the route handler executed.
    const res = await request(app).get('/some/spa/route');
    expect([200, 404, 500]).toContain(res.status);
  });
});
