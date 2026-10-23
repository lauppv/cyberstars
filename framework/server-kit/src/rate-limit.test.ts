import { describe, it, expect } from 'vitest';
import express from 'express';
import request from 'supertest';
import { makeLimiter } from './rate-limit.js';

function appWith(limiter: express.RequestHandler) {
  const app = express();
  app.get('/', limiter, (_req, res) => {
    res.sendStatus(204);
  });
  return app;
}

async function hits(app: express.Express, times: number) {
  const statuses = [];
  for (let i = 0; i < times; i++) statuses.push((await request(app).get('/')).status);
  return statuses;
}

describe('makeLimiter', () => {
  it('limits outside tests and sends only the standard headers', async () => {
    const app = appWith(makeLimiter(() => false)({ windowMs: 60_000, limit: 1 }));
    expect(await hits(app, 2)).toEqual([204, 429]);
    const res = await request(app).get('/');
    expect(res.headers['ratelimit-limit']).toBe('1');
    expect(res.headers['x-ratelimit-limit']).toBeUndefined();
  });

  it('lets everything through in tests', async () => {
    const app = appWith(makeLimiter(() => true)({ windowMs: 60_000, limit: 1 }));
    expect(await hits(app, 3)).toEqual([204, 204, 204]);
  });

  it('keeps counting in tests when asked to', async () => {
    const limiter = makeLimiter(() => true)({ windowMs: 60_000, limit: 1, alsoInTests: true });
    expect(await hits(appWith(limiter), 2)).toEqual([204, 429]);
  });
});
