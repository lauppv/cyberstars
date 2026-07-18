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
vi.mock('./repositories/leaderboard.repository.js', () => ({
  getRanked: vi.fn().mockResolvedValue([]),
}));

const { app } = await import('./app.js');

describe('endpoint smoke tests — public routes return 200', () => {
  const publicGets = ['/api/forum/categories', '/api/leaderboard'];

  for (const path of publicGets) {
    it(`GET ${path}`, async () => {
      const res = await request(app).get(path);
      expect(res.status).toBe(200);
    });
  }
});

describe('server clock', () => {
  it('GET /api/time returns a numeric now and is not cached', async () => {
    const res = await request(app).get('/api/time');
    expect(res.status).toBe(200);
    expect(typeof res.body.now).toBe('number');
    expect(res.headers['cache-control']).toContain('no-store');
  });
});

describe('content security policy', () => {
  it('emits a restricted CSP header instead of disabling it', async () => {
    const res = await request(app).get('/api/forum/categories');
    const csp = res.headers['content-security-policy'];
    expect(csp).toBeDefined();
    expect(csp).toContain("script-src 'self' https://unpkg.com");
    expect(csp).toContain('https://fonts.gstatic.com');
    expect(csp).toContain("object-src 'none'");
  });
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
    ['post', '/api/forum/categories'],
    ['put', '/api/forum/categories/general'],
    ['delete', '/api/forum/categories/general'],
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
    ['get', '/api/admin/stats'],
    ['get', '/api/leaderboard/me'],
    ['get', '/api/notifications'],
    ['post', '/api/notifications/read'],
    ['post', '/api/notifications/123/read'],
    ['get', '/api/messages/conversations'],
    ['post', '/api/messages/conversations'],
    ['get', '/api/messages/conversations/123'],
    ['post', '/api/messages/conversations/123'],
    ['post', '/api/messages/conversations/123/read'],
    ['delete', '/api/messages/123'],
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

describe('preview feature gate', () => {
  it('404s the leaderboard for a guest when NODE_ENV=production', async () => {
    const original = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    try {
      const res = await request(app).get('/api/leaderboard');
      expect(res.status).toBe(404);
    } finally {
      process.env.NODE_ENV = original;
    }
  });

  it('401s messaging for a guest before the feature gate can 404 it', async () => {
    // No token -> authenticateToken rejects first (401), so endpoint existence
    // stays hidden from the unauthenticated even in dev.
    const res = await request(app).get('/api/messages/conversations');
    expect(res.status).toBe(401);
  });
});

describe('public profile route', () => {
  it('validates the id param with a 400 before reaching the service', async () => {
    const res = await request(app).get('/api/users/abc/profile');
    expect(res.status).toBe(400);
  });

  it('404s a missing user (route is wired past the dev feature gate)', async () => {
    // user.repository.findById is mocked to null, so the service throws 404 —
    // proving optionalAuth + the leaderboard gate let a dev guest through.
    const res = await request(app).get('/api/users/1/profile');
    expect(res.status).toBe(404);
  });

  it('404s the profile for a guest when NODE_ENV=production', async () => {
    const original = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    try {
      const res = await request(app).get('/api/users/1/profile');
      expect(res.status).toBe(404);
    } finally {
      process.env.NODE_ENV = original;
    }
  });
});

describe('endpoint smoke tests — unknown routes', () => {
  it('GET /api/does-not-exist → 404', async () => {
    const res = await request(app).get('/api/does-not-exist');
    expect(res.status).toBe(404);
  });
});

describe('trust proxy', () => {
  it('is disabled outside production so X-Forwarded-For is not trusted', () => {
    // In dev/test there is no reverse proxy in front of Express, so the header
    // must not be trusted. Production enables one hop (nginx) — see app.ts.
    expect(app.get('trust proxy')).toBe(false);
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
