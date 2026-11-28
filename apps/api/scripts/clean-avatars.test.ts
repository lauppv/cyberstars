import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import sharp from 'sharp';
import { cleanAvatarsDir } from './clean-avatars.js';

// Lets a test do something while a file is being cleaned, as an upload would
const during = vi.hoisted(() => ({ clean: null as null | ((input: Buffer) => Promise<void>) }));
vi.mock('../src/services/avatar-image.service.js', async (importOriginal) => {
  const real = await importOriginal<typeof import('../src/services/avatar-image.service.js')>();
  return {
    ...real,
    cleanAvatar: async (...args: Parameters<typeof real.cleanAvatar>) => {
      await during.clean?.(args[0]);
      return real.cleanAvatar(...args);
    },
  };
});

let dir: string;
beforeEach(async () => {
  dir = await fs.mkdtemp(path.join(os.tmpdir(), 'avatars-'));
});
afterEach(async () => {
  during.clean = null;
  await fs.rm(dir, { recursive: true, force: true });
});

const photo = (format: 'jpeg' | 'png' | 'webp') =>
  sharp({ create: { width: 600, height: 400, channels: 3, background: '#888' } })
    .toFormat(format)
    .withExif({
      IFD0: { Copyright: 'home-secret' },
      IFD3: { GPSLatitudeRef: 'N', GPSLatitude: '45/1 45/1 0/1' },
    })
    .toBuffer();

describe('cleanAvatarsDir', () => {
  it('cleans each old avatar in place, keeping its name and format', async () => {
    for (const [name, format] of [
      ['1-1.jpg', 'jpeg'],
      ['2-2.png', 'png'],
      ['3-3.webp', 'webp'],
    ] as const) {
      await fs.writeFile(path.join(dir, name), await photo(format));
    }

    const report = await cleanAvatarsDir(dir);
    expect(report.map((r) => r.outcome)).toEqual(['cleaned', 'cleaned', 'cleaned']);

    for (const [name, format] of [
      ['1-1.jpg', 'jpeg'],
      ['2-2.png', 'png'],
      ['3-3.webp', 'webp'],
    ] as const) {
      const saved = await fs.readFile(path.join(dir, name));
      const meta = await sharp(saved).metadata();
      expect(meta.format).toBe(format);
      expect(meta.exif).toBeUndefined();
      expect(saved.includes('home-secret')).toBe(false);
    }
    // No temporary file left behind
    expect((await fs.readdir(dir)).sort()).toEqual(['1-1.jpg', '2-2.png', '3-3.webp']);
  });

  it('leaves a clean avatar alone, so it can run again', async () => {
    await fs.writeFile(path.join(dir, '1-1.jpg'), await photo('jpeg'));
    await cleanAvatarsDir(dir);
    const once = await fs.readFile(path.join(dir, '1-1.jpg'));

    const report = await cleanAvatarsDir(dir);
    expect(report).toEqual([{ file: '1-1.jpg', outcome: 'clean' }]);
    expect(await fs.readFile(path.join(dir, '1-1.jpg'))).toEqual(once);
  });

  it('keeps a long old animation whole', async () => {
    const frames = await Promise.all(
      ['#f00', '#00f'].map((c) =>
        sharp({ create: { width: 300, height: 300, channels: 4, background: c } })
          .png()
          .toBuffer(),
      ),
    );
    const gif = await sharp(
      Array.from({ length: 120 }, (_, i) => frames[i % 2]),
      { join: { animated: true } },
    )
      .gif()
      .toBuffer();
    await fs.writeFile(path.join(dir, '1-1.gif'), gif);

    expect(await cleanAvatarsDir(dir)).toEqual([{ file: '1-1.gif', outcome: 'cleaned' }]);
    const meta = await sharp(await fs.readFile(path.join(dir, '1-1.gif')), {
      animated: true,
    }).metadata();
    expect(meta.pages).toBe(120);
    expect(meta.width).toBe(256);
  });

  it('changes nothing on a dry run', async () => {
    const input = await photo('jpeg');
    await fs.writeFile(path.join(dir, '1-1.jpg'), input);
    expect(await cleanAvatarsDir(dir, { dryRun: true })).toEqual([
      { file: '1-1.jpg', outcome: 'cleaned', reason: 'dry run' },
    ]);
    expect(await fs.readFile(path.join(dir, '1-1.jpg'))).toEqual(input);
  });

  it('reports a file it cannot read and goes on with the rest', async () => {
    await fs.writeFile(path.join(dir, '1-1.png'), 'not a picture');
    await fs.writeFile(path.join(dir, '2-2.jpg'), await photo('jpeg'));
    await fs.writeFile(path.join(dir, '.3-3.jpg.tmp'), 'left from a run that stopped');
    await fs.mkdir(path.join(dir, 'sub'));

    const report = await cleanAvatarsDir(dir);
    expect(report.map((r) => [r.file, r.outcome])).toEqual([
      ['1-1.png', 'failed'],
      ['2-2.jpg', 'cleaned'],
    ]);
    expect(await fs.readFile(path.join(dir, '1-1.png'), 'utf8')).toBe('not a picture');
  });

  it('skips an avatar its owner replaced while it was cleaned, bringing nothing back', async () => {
    await fs.writeFile(path.join(dir, '1-1.jpg'), await photo('jpeg'));
    await fs.writeFile(path.join(dir, '2-2.jpg'), await photo('jpeg'));
    during.clean = async () => {
      // The upload of a new avatar deletes the old file
      await fs.rm(path.join(dir, '1-1.jpg'), { force: true });
    };

    const report = await cleanAvatarsDir(dir);
    expect(report.map((r) => [r.file, r.outcome, r.reason])).toEqual([
      ['1-1.jpg', 'skipped', 'gone'],
      ['2-2.jpg', 'cleaned', undefined],
    ]);
    expect(await fs.readdir(dir)).toEqual(['2-2.jpg']);
  });

  it('reports a file it cannot write and goes on with the rest', async () => {
    await fs.writeFile(path.join(dir, '1-1.jpg'), await photo('jpeg'));
    await fs.writeFile(path.join(dir, '2-2.jpg'), await photo('jpeg'));
    // The first file's temporary name is taken by a folder, so writing it fails
    await fs.mkdir(path.join(dir, '.1-1.jpg.tmp'));

    const report = await cleanAvatarsDir(dir);
    expect(report.map((r) => [r.file, r.outcome])).toEqual([
      ['1-1.jpg', 'failed'],
      ['2-2.jpg', 'cleaned'],
    ]);
  });

  it('finds nothing to do without the folder', async () => {
    expect(await cleanAvatarsDir(path.join(dir, 'missing'))).toEqual([]);
  });
});
