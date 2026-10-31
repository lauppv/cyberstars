import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import zlib from 'zlib';
import express from 'express';
import request from 'supertest';
import { serveStatic } from './static.js';

let dir: string;
let root: string;
let app: express.Express;

const script = 'console.log("Hello, Stars!");\n'.repeat(100);
const curriculum = JSON.stringify(
  Array.from({ length: 50 }, (_, i) => ({ key: `course-${i}`, lessons: [] })),
);
const size = (file: string) => String(fs.statSync(path.join(root, file)).size);
const CHROME = 'gzip, deflate, br, zstd';
const YEAR = 'public, max-age=31536000, immutable';
const SECRET = 'outside the build';

// A build as compress.ts leaves it: the main script with both copies,
// curriculum.json with only a gzip one, a small lesson and a font with none
beforeAll(() => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), 'static-'));
  root = path.join(dir, 'dist');
  const write = (file: string, data: string | Buffer) => {
    fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    fs.writeFileSync(path.join(root, file), data);
  };
  write('assets/index-abc.js', script);
  write('assets/index-abc.js.br', zlib.brotliCompressSync(script));
  write('assets/index-abc.js.gz', zlib.gzipSync(script));
  write('curriculum.json', curriculum);
  write('curriculum.json.gz', zlib.gzipSync(curriculum));
  write('lessons/python/print.md', '# Print');
  write('assets/inter-abc.woff2', Buffer.from([0x77, 0x4f, 0x46, 0x32]));
  // Outside the build, where no address may reach
  fs.writeFileSync(path.join(dir, 'secret.js'), SECRET);
  fs.writeFileSync(path.join(dir, 'secret.js.br'), zlib.brotliCompressSync(SECRET));
  app = express();
  app.use(serveStatic(root));
});

afterAll(() => fs.rmSync(dir, { recursive: true, force: true }));

describe('serveStatic', () => {
  it('sends Chrome the Brotli copy, though it names gzip first', async () => {
    const res = await request(app).get('/assets/index-abc.js').set('Accept-Encoding', CHROME);
    expect(res.status).toBe(200);
    expect(res.headers['content-encoding']).toBe('br');
    expect(res.headers['content-length']).toBe(size('assets/index-abc.js.br'));
    expect(res.text).toBe(script);
  });

  it('sends the gzip copy to a browser that takes only gzip', async () => {
    const res = await request(app).get('/assets/index-abc.js').set('Accept-Encoding', 'gzip');
    expect(res.headers['content-encoding']).toBe('gzip');
    expect(res.headers['content-length']).toBe(size('assets/index-abc.js.gz'));
    expect(res.text).toBe(script);
  });

  // An empty header reads as a missing one; supertest always sends one
  it('sends the file itself when the browser takes neither', async () => {
    for (const accepted of ['', 'identity', 'br;q=0, gzip;q=0', 'deflate']) {
      const res = await request(app).get('/assets/index-abc.js').set('Accept-Encoding', accepted);
      expect(res.headers['content-encoding'], accepted).toBeUndefined();
      expect(res.headers['content-length'], accepted).toBe(size('assets/index-abc.js'));
    }
  });

  it('falls back to gzip when the build left no Brotli copy', async () => {
    const res = await request(app).get('/curriculum.json').set('Accept-Encoding', CHROME);
    expect(res.headers['content-encoding']).toBe('gzip');
    expect(res.body).toEqual(JSON.parse(curriculum));
  });

  it('sends a file without copies as it is', async () => {
    const res = await request(app).get('/lessons/python/print.md').set('Accept-Encoding', CHROME);
    expect(res.status).toBe(200);
    expect(res.headers['content-encoding']).toBeUndefined();
    expect(res.text).toBe('# Print');
  });

  it('gives a copy the type of the file it stands for, of every kind', async () => {
    const kinds = path.join(dir, 'kinds');
    const kindsApp = express().use(serveStatic(kinds));
    fs.mkdirSync(kinds);
    for (const ext of ['js', 'css', 'json', 'svg', 'md', 'xml']) {
      fs.writeFileSync(path.join(kinds, `file.${ext}`), '{}');
      fs.writeFileSync(path.join(kinds, `file.${ext}.br`), zlib.brotliCompressSync('{}'));
      const asIs = await request(kindsApp).get(`/file.${ext}`).set('Accept-Encoding', '');
      const copy = await request(kindsApp).get(`/file.${ext}`).set('Accept-Encoding', 'br');
      expect(copy.headers['content-encoding'], ext).toBe('br');
      expect(copy.headers['content-type'], ext).toBe(asIs.headers['content-type']);
    }
  });

  it('leaves anything but GET and HEAD to the static files', async () => {
    const res = await request(app).post('/assets/index-abc.js').set('Accept-Encoding', 'br');
    expect(res.status).toBe(404);
    expect(res.headers['content-encoding']).toBeUndefined();
  });

  it('tells caches the answer depends on Accept-Encoding, copy or not', async () => {
    for (const accepted of ['br', 'identity']) {
      const res = await request(app).get('/assets/index-abc.js').set('Accept-Encoding', accepted);
      expect(res.headers.vary, accepted).toMatch(/Accept-Encoding/);
    }
  });

  it('keeps the files under assets/ a year, copy or not', async () => {
    for (const accepted of ['br', 'identity']) {
      const res = await request(app).get('/assets/index-abc.js').set('Accept-Encoding', accepted);
      expect(res.headers['cache-control'], accepted).toBe(YEAR);
    }
    const font = await request(app).get('/assets/inter-abc.woff2');
    expect(font.headers['cache-control']).toBe(YEAR);
  });

  it('has the browser ask again for a file whose name outlives a deploy', async () => {
    for (const accepted of ['gzip', 'identity']) {
      const res = await request(app).get('/curriculum.json').set('Accept-Encoding', accepted);
      expect(res.headers['cache-control'], accepted).toBe('public, max-age=0');
      const again = await request(app)
        .get('/curriculum.json')
        .set('Accept-Encoding', accepted)
        .set('If-None-Match', res.headers.etag);
      expect(again.status, accepted).toBe(304);
    }
  });

  it('answers HEAD with the copy it would send', async () => {
    const res = await request(app).head('/assets/index-abc.js').set('Accept-Encoding', 'br');
    expect(res.status).toBe(200);
    expect(res.headers['content-encoding']).toBe('br');
    expect(res.headers['content-length']).toBe(size('assets/index-abc.js.br'));
  });

  it('answers what the copy cannot as the file alone would', async () => {
    const copy = size('assets/index-abc.js.br');
    for (const [header, value] of [
      ['Range', `bytes=${copy}-`],
      ['Range', `bytes=${script.length}-`],
      ['If-Match', '"other"'],
    ]) {
      const get = (accepted: string) =>
        request(app)
          .get('/assets/index-abc.js')
          .set('Accept-Encoding', accepted)
          .set(header, value);
      const [alone, res] = await Promise.all([get('identity'), get(CHROME)]);
      expect(res.status, value).toBe(alone.status);
      expect(res.headers['content-encoding'], value).toBeUndefined();
      expect(res.headers.etag, value).toBe(alone.headers.etag);
      expect(res.text, value).toBe(alone.text);
    }
  });

  it('answers 404 for a file that is not there, with no cache', async () => {
    const res = await request(app).get('/assets/index-gone.js').set('Accept-Encoding', CHROME);
    expect(res.status).toBe(404);
    expect(res.headers['content-encoding']).toBeUndefined();
    expect(res.headers['cache-control']).not.toBe(YEAR);
  });

  it('reaches nothing outside the build', async () => {
    for (const address of ['/..%2fsecret.js', '/assets/..%2f..%2fsecret.js', '/%2e%2e/secret.js']) {
      const res = await request(app).get(address).set('Accept-Encoding', CHROME);
      expect(res.status, address).toBeGreaterThanOrEqual(400);
      expect(res.text ?? '', address).not.toContain(SECRET);
    }
  });

  it('sends a copy from a build inside a folder whose name starts with a dot', async () => {
    const hidden = path.join(dir, '.checkout', 'dist');
    fs.mkdirSync(hidden, { recursive: true });
    fs.writeFileSync(path.join(hidden, 'app.js.br'), zlib.brotliCompressSync(script));
    const res = await request(express().use(serveStatic(hidden)))
      .get('/app.js')
      .set('Accept-Encoding', 'br');
    expect(res.status).toBe(200);
    expect(res.text).toBe(script);
  });

  it('passes a malformed address on to the static files', async () => {
    const res = await request(app).get('/assets/%E0%A4%A.js').set('Accept-Encoding', CHROME);
    expect(res.status).toBe(404);
  });
});
