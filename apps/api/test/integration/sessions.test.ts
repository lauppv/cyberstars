import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import http from 'node:http';
import type { AddressInfo } from 'node:net';
import WebSocket from 'ws';
import type { Response } from 'supertest';
import { app } from '../../src/app.js';
import { prisma } from '../../src/config/db.js';
import { attachRunWebSocket } from '../../src/services/ws-run.js';
import { pushToUser } from '../../src/services/ws-user.js';
import { agent, createAuthenticatedAgent, userIdFor } from './helpers.js';

let server: http.Server;
let detach: () => void;
let wsUrl: string;

beforeAll(async () => {
  server = http.createServer(app);
  detach = attachRunWebSocket(server).close;
  await new Promise<void>((resolve) => server.listen(0, resolve));
  wsUrl = `ws://127.0.0.1:${(server.address() as AddressInfo).port}/ws/user`;
});

afterAll(async () => {
  detach();
  await new Promise((resolve) => server.close(resolve));
});

// The `token=...` pair a response set, as a browser would send it back
function tokenCookie(res: Response): string {
  const cookies = res.headers['set-cookie'] as unknown as string[];
  return cookies.find((c) => c.startsWith('token='))!.split(';')[0];
}

// A second browser signed in to the same account
async function signIn(email: string, password: string) {
  const a = agent();
  const res = await a.post('/auth/login').send({ email, password }).expect(200);
  return { agent: a, cookie: tokenCookie(res) };
}

// A /ws/user socket with its frames and, once it closes, the close code
function openUserSocket(cookie: string) {
  const ws = new WebSocket(wsUrl, { headers: { cookie } });
  const frames: unknown[] = [];
  ws.on('message', (data) => frames.push(JSON.parse(String(data))));
  const closed = new Promise<number>((resolve) => ws.on('close', (code) => resolve(code)));
  const opened = new Promise<void>((resolve) => ws.on('open', () => resolve()));
  return { ws, frames, closed, opened };
}

const frame = {
  channel: 'notification' as const,
  type: 'unread-count' as const,
  payload: { unreadCount: 1 },
};

describe('Sessions after a password change', () => {
  it('ends every other session and keeps the one that made the change', async () => {
    const { agent: first, email, password, res } = await createAuthenticatedAgent();
    const second = await signIn(email, password);

    await first
      .post('/api/profile/password')
      .send({ currentPassword: password, newPassword: 'brand-new-pass' })
      .expect(200);

    await first.get('/auth/me').expect(200);
    const refused = await second.agent.get('/auth/me').expect(403);
    expect(refused.body.error).toBe('Invalid token');
    // the token from before the change, wherever it was copied
    await agent().get('/auth/me').set('Cookie', tokenCookie(res)).expect(403);
  });

  it('closes the notification sockets and lets only the new token back in', async () => {
    const { agent: first, email, password, res: signup } = await createAuthenticatedAgent();
    const second = await signIn(email, password);
    const id = await userIdFor(email);
    const mine = openUserSocket(tokenCookie(signup));
    const theirs = openUserSocket(second.cookie);
    await Promise.all([mine.opened, theirs.opened]);

    const res = await first
      .post('/api/profile/password')
      .send({ currentPassword: password, newPassword: 'brand-new-pass' })
      .expect(200);

    // both close; each tab then tries again with the cookie it has
    expect(await mine.closed).toBe(4000);
    expect(await theirs.closed).toBe(4000);

    const ended = openUserSocket(second.cookie);
    expect(await ended.closed).toBe(4401);

    // the browser that made the change got a new token and keeps its feed
    const fresh = openUserSocket(tokenCookie(res));
    await fresh.opened;
    pushToUser(id, frame);
    await expect.poll(() => fresh.frames).toEqual([frame]);
    fresh.ws.close();
  });
});

describe('Sessions after a password reset', () => {
  it('ends every session of the account', async () => {
    const { agent: first, email, password } = await createAuthenticatedAgent();
    const second = await signIn(email, password);
    const socket = openUserSocket(second.cookie);
    await socket.opened;

    await agent().post('/auth/forgot-password').send({ email }).expect(200);
    const { resetCode } = await prisma.user.findUniqueOrThrow({ where: { email } });
    await agent()
      .post('/auth/reset-password')
      .send({ email, code: resetCode, password: 'brand-new-pass' })
      .expect(200);

    await first.get('/auth/me').expect(403);
    await second.agent.get('/auth/me').expect(403);
    expect(await socket.closed).toBe(4000);
    await signIn(email, 'brand-new-pass');
  });
});
