import { describe, it, expect, vi } from 'vitest';
import express, { type NextFunction, type Request, type Response } from 'express';
import request from 'supertest';

// The limiters must count here, so the routes load as on production
vi.mock('../config/index.js', async (importOriginal) => {
  const { config } = await importOriginal<typeof import('../config/index.js')>();
  return { config: { ...config, isTest: false } };
});

// The account comes from a header, so each test can be someone else
vi.mock('../middleware/auth.js', () => ({
  authenticateToken: (req: Request, _res: Response, next: NextFunction) => {
    req.user = { id: Number(req.headers['x-user']) } as Request['user'];
    next();
  },
}));

const created = (_req: Request, res: Response) => {
  res.status(201).json({ ok: true });
};
vi.mock('../controllers/support.controller.js', () => ({
  createTicket: created,
  addTicketMessage: created,
  getMyTickets: vi.fn(),
  getAllTickets: vi.fn(),
  updateTicketStatus: vi.fn(),
  getTicketMessages: vi.fn(),
}));

const { default: supportRoutes } = await import('./support.routes.js');

function makeApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/support', supportRoutes);
  return app;
}

const ticket = { type: 'BUG', subject: 'Run hangs', message: 'It hangs' };

describe('support routes: rate limits', () => {
  it('lets one account open 5 tickets in 15 minutes, then answers 429', async () => {
    const app = makeApp();
    for (let i = 0; i < 5; i++) {
      const ok = await request(app).post('/api/support/tickets').set('x-user', '1').send(ticket);
      expect(ok.status).toBe(201);
    }
    const res = await request(app).post('/api/support/tickets').set('x-user', '1').send(ticket);
    expect(res.status).toBe(429);

    // Another account, on the same IP, is not held back
    const other = await request(app).post('/api/support/tickets').set('x-user', '2').send(ticket);
    expect(other.status).toBe(201);
  });

  it('lets one account send 20 replies a minute, then answers 429', async () => {
    const app = makeApp();
    const reply = () =>
      request(app)
        .post('/api/support/tickets/7/messages')
        .set('x-user', '3')
        .send({ message: 'More details' });
    for (let i = 0; i < 20; i++) expect((await reply()).status).toBe(201);
    expect((await reply()).status).toBe(429);
  });

  it('counts a message refused for its length too', async () => {
    const app = makeApp();
    const long = { ...ticket, message: 'a'.repeat(5001) };
    for (let i = 0; i < 5; i++) {
      const res = await request(app).post('/api/support/tickets').set('x-user', '4').send(long);
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Message is too long (max 5000 chars)');
    }
    const res = await request(app).post('/api/support/tickets').set('x-user', '4').send(ticket);
    expect(res.status).toBe(429);
  });
});
