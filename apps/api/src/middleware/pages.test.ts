import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import express from 'express';
import request from 'supertest';
import { servePages } from './pages.js';

let dir: string;
let app: express.Express;

// A build with the landing page, one lesson and its Romanian twin
beforeAll(() => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pages-'));
  const write = (file: string, text: string) => {
    fs.mkdirSync(path.dirname(path.join(dir, file)), { recursive: true });
    fs.writeFileSync(path.join(dir, file), text);
  };
  write('index.html', 'landing');
  write('lesson/python/print.html', 'print lesson');
  write('ro/lesson/python/print.html', 'lectia print');
  write('ro.html', 'acasa');
  app = express();
  app.get(/^\/(?!api|auth)[^.]*$/, servePages(dir));
});

afterAll(() => fs.rmSync(dir, { recursive: true, force: true }));

describe('servePages', () => {
  it('sends a public page its own pre-rendered HTML', async () => {
    const res = await request(app).get('/lesson/python/print');
    expect(res.status).toBe(200);
    expect(res.text).toBe('print lesson');
    expect(res.headers['x-robots-tag']).toBeUndefined();
  });

  it('sends the Romanian twin and the home pages', async () => {
    expect((await request(app).get('/ro/lesson/python/print')).text).toBe('lectia print');
    expect((await request(app).get('/ro')).text).toBe('acasa');
    expect((await request(app).get('/')).text).toBe('landing');
  });

  it('ignores a trailing slash', async () => {
    expect((await request(app).get('/lesson/python/print/')).text).toBe('print lesson');
  });

  it('sends an app-only page the app, kept out of search results', async () => {
    for (const address of ['/profile', '/forum/t/42', '/ro/settings', '/u/7']) {
      const res = await request(app).get(address);
      expect(res.status, address).toBe(200);
      expect(res.text).toBe('landing');
      expect(res.headers['x-robots-tag']).toBe('noindex');
    }
  });

  it('answers 404 for a page that does not exist', async () => {
    for (const address of ['/lesson/python/nope', '/nope', '/ro/courses/nope', '/forum/t']) {
      const res = await request(app).get(address);
      expect(res.status, address).toBe(404);
      expect(res.headers['x-robots-tag']).toBe('noindex');
    }
  });
});
