import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import os from 'node:os';
import path from 'node:path';
import { brotliDecompressSync, gunzipSync } from 'node:zlib';
import { compressDir, MIN_SIZE } from './compress';

let dir: string;
const write = (file: string, data: string | Buffer) => {
  mkdirSync(path.dirname(path.join(dir, file)), { recursive: true });
  writeFileSync(path.join(dir, file), data);
};
const has = (file: string) => existsSync(path.join(dir, file));
const text = 'print("Hello, Stars!")\n'.repeat(100);

beforeEach(() => {
  dir = mkdtempSync(path.join(os.tmpdir(), 'compress-'));
});
afterEach(() => rmSync(dir, { recursive: true, force: true }));

describe('compressDir', () => {
  it('writes a Brotli and a gzip copy that open to the file, in every folder', () => {
    write('assets/index-abc.js', text);
    write('lessons/python/ro/print.md', text);
    compressDir(dir);
    for (const file of ['assets/index-abc.js', 'lessons/python/ro/print.md']) {
      const original = readFileSync(path.join(dir, file));
      expect(brotliDecompressSync(readFileSync(path.join(dir, `${file}.br`)))).toEqual(original);
      expect(gunzipSync(readFileSync(path.join(dir, `${file}.gz`)))).toEqual(original);
    }
  });

  it('copies every kind the server sends copies of, and nothing else', () => {
    for (const ext of ['js', 'css', 'json', 'svg', 'md', 'xml', 'html', 'woff2', 'txt']) {
      write(`file.${ext}`, text);
    }
    compressDir(dir);
    for (const ext of ['js', 'css', 'json', 'svg', 'md', 'xml']) {
      expect(has(`file.${ext}.br`), ext).toBe(true);
    }
    for (const ext of ['html', 'woff2', 'txt']) {
      expect(has(`file.${ext}.gz`), ext).toBe(false);
    }
  });

  it('leaves a file under 1 KB as it is', () => {
    write('small.md', text.slice(0, MIN_SIZE - 1));
    write('big.md', text.slice(0, MIN_SIZE));
    compressDir(dir);
    expect(has('small.md.br')).toBe(false);
    expect(has('small.md.gz')).toBe(false);
    expect(has('big.md.br')).toBe(true);
  });

  it('writes no copy that comes out bigger than its file', () => {
    write('noise.json', randomBytes(4096));
    const sizes = compressDir(dir);
    expect(has('noise.json.br')).toBe(false);
    expect(has('noise.json.gz')).toBe(false);
    // The file itself is what goes out, so it counts at its own size
    expect(sizes).toEqual({ files: 1, raw: 4096, br: 4096, gzip: 4096 });
  });

  it("doesn't compress its own copies when run again", () => {
    write('app.js', text);
    compressDir(dir);
    const again = compressDir(dir);
    expect(again.files).toBe(1);
    expect(has('app.js.br.gz')).toBe(false);
    expect(has('app.js.gz.br')).toBe(false);
  });
});
