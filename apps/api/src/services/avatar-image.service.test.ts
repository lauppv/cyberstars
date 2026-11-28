import { describe, it, expect } from 'vitest';
import sharp from 'sharp';
import { AppError } from '@cyberstars-framework/server-kit/errors';
import { AVATAR_SIZE, MAX_FRAMES, cleanAvatar } from './avatar-image.service.js';

const solid = (width: number, height: number, background: string) =>
  sharp({ create: { width, height, channels: 3, background } });

// A phone photo: where it was taken, who took it, and turned by its EXIF.
const phonePhoto = () =>
  solid(120, 80, '#888')
    .jpeg()
    .withExif({
      IFD0: { Copyright: 'home-secret', Make: 'PhoneCo' },
      IFD3: { GPSLatitudeRef: 'N', GPSLatitude: '45/1 45/1 0/1' },
    })
    .toBuffer();

async function animation(frames: number, width = 40, height = 20) {
  const colours = ['#f00', '#00f'];
  const pictures = await Promise.all(
    colours.map((c) =>
      sharp({ create: { width, height, channels: 4, background: c } })
        .png()
        .toBuffer(),
    ),
  );
  // Alternating colours, so the GIF encoder can't fold frames together
  const list = Array.from({ length: frames }, (_, i) => pictures[i % 2]);
  return sharp(list, { join: { animated: true } })
    .gif()
    .toBuffer();
}

async function rejection(promise: Promise<unknown>): Promise<AppError> {
  const err = await promise.then(
    () => null,
    (e: unknown) => e,
  );
  expect(err).toBeInstanceOf(AppError);
  return err as AppError;
}

describe('cleanAvatar', () => {
  it('drops the EXIF of a phone photo, location included', async () => {
    const input = await phonePhoto();
    const before = await sharp(input).metadata();
    expect(before.exif?.includes('home-secret')).toBe(true);
    // The GPS IFD pointer (tag 0x8825, in either byte order) is there before
    const gps = [Buffer.from([0x88, 0x25]), Buffer.from([0x25, 0x88])];
    expect(gps.some((tag) => before.exif?.includes(tag))).toBe(true);

    const output = await cleanAvatar(input);
    const after = await sharp(output).metadata();
    expect(after.format).toBe('webp');
    expect(after.exif).toBeUndefined();
    expect(after.xmp).toBeUndefined();
    expect(after.iptc).toBeUndefined();
    expect(after.icc).toBeUndefined();
    expect(output.includes('home-secret')).toBe(false);
    expect(output.includes('PhoneCo')).toBe(false);
  });

  it('turns a photo the way its EXIF says, so it stays the right way up', async () => {
    // Top half red, bottom half blue; orientation 6 means "turn 90° clockwise to view",
    // so the viewer sees red on the right and blue on the left.
    const top = await solid(100, 50, '#f00').png().toBuffer();
    const input = await solid(100, 100, '#00f')
      .composite([{ input: top, top: 0, left: 0 }])
      .jpeg()
      .withMetadata({ orientation: 6 })
      .toBuffer();

    const { data, info } = await sharp(await cleanAvatar(input))
      .raw()
      .toBuffer({ resolveWithObject: true });
    const pixel = (x: number, y: number) => {
      const at = (y * info.width + x) * info.channels;
      return [data[at], data[at + 1], data[at + 2]];
    };
    const [lr, , lb] = pixel(20, AVATAR_SIZE / 2);
    const [rr, , rb] = pixel(AVATAR_SIZE - 20, AVATAR_SIZE / 2);
    expect(lb).toBeGreaterThan(200);
    expect(lr).toBeLessThan(50);
    expect(rr).toBeGreaterThan(200);
    expect(rb).toBeLessThan(50);
    expect((await sharp(await cleanAvatar(input)).metadata()).orientation).toBeUndefined();
  });

  it('cuts any picture to a square of AVATAR_SIZE, small ones too', async () => {
    for (const [w, h] of [
      [1200, 400],
      [300, 900],
      [1, 1],
    ]) {
      const meta = await sharp(
        await cleanAvatar(await solid(w, h, '#abc').png().toBuffer()),
      ).metadata();
      expect([meta.width, meta.height]).toEqual([AVATAR_SIZE, AVATAR_SIZE]);
    }
  });

  it('drops XMP and colour profiles, turning the colours into plain sRGB', async () => {
    const xmp = await solid(50, 50, '#fff')
      .webp()
      .withXmp('<x:xmpmeta xmlns:x="adobe:ns:meta/"><s>home-secret</s></x:xmpmeta>')
      .toBuffer();
    expect((await sharp(xmp).metadata()).xmp).toBeDefined();
    const fromXmp = await cleanAvatar(xmp);
    expect((await sharp(fromXmp).metadata()).xmp).toBeUndefined();
    expect(fromXmp.includes('home-secret')).toBe(false);

    const p3 = await solid(50, 50, '#c08040').jpeg().withIccProfile('p3').toBuffer();
    expect((await sharp(p3).metadata()).icc).toBeDefined();
    const fromP3 = await sharp(await cleanAvatar(p3)).metadata();
    expect(fromP3.icc).toBeUndefined();
    expect(fromP3.space).toBe('srgb');

    const cmyk = await solid(50, 50, '#c08040').toColourspace('cmyk').jpeg().toBuffer();
    expect((await sharp(await cleanAvatar(cmyk)).metadata()).space).toBe('srgb');
  });

  it('keeps transparency', async () => {
    const input = await sharp({
      create: { width: 60, height: 60, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
    })
      .png()
      .toBuffer();
    expect((await sharp(await cleanAvatar(input)).metadata()).hasAlpha).toBe(true);
  });

  it('keeps an animation animated', async () => {
    const output = await cleanAvatar(await animation(3, 300, 200));
    const meta = await sharp(output, { animated: true }).metadata();
    expect(meta.format).toBe('webp');
    expect(meta.pages).toBe(3);
    expect([meta.width, meta.pageHeight]).toEqual([AVATAR_SIZE, AVATAR_SIZE]);
  });

  it('takes an animation turned by its EXIF without failing (sharp cannot turn one)', async () => {
    const pictures = await Promise.all(
      ['#f00', '#00f'].map((c) =>
        sharp({ create: { width: 40, height: 20, channels: 4, background: c } })
          .png()
          .toBuffer(),
      ),
    );
    const input = await sharp(pictures, { join: { animated: true } })
      .webp()
      .withMetadata({ orientation: 6 })
      .toBuffer();
    const meta = await sharp(await cleanAvatar(input), { animated: true }).metadata();
    expect(meta.pages).toBe(2);
    expect(meta.exif).toBeUndefined();
  });

  it(`refuses an animation of more than ${MAX_FRAMES} frames`, async () => {
    const err = await rejection(cleanAvatar(await animation(MAX_FRAMES + 1, 8, 8)));
    expect(err.statusCode).toBe(400);
    expect(err.message).toMatch(/at most 100 frames/);
    // The cleanup of old files may lift the cap
    const meta = await sharp(
      await cleanAvatar(await animation(MAX_FRAMES + 1, 8, 8), { maxFrames: Infinity }),
      { animated: true },
    ).metadata();
    expect(meta.pages).toBe(MAX_FRAMES + 1);
  });

  it('refuses a small file that unpacks into a huge picture', async () => {
    const bomb = await solid(7000, 7000, '#000').png().toBuffer();
    expect(bomb.length).toBeLessThan(2 * 1024 * 1024);
    const err = await rejection(cleanAvatar(bomb));
    expect(err.statusCode).toBe(400);
    expect(err.message).toMatch(/too big/);
  });

  it('refuses a broken picture with a 400, not a 500', async () => {
    const photo = await phonePhoto();
    for (const input of [photo.subarray(0, 200), Buffer.from('GIF89a broken'), Buffer.from('x')]) {
      const err = await rejection(cleanAvatar(input));
      expect(err.statusCode).toBe(400);
      expect(err.message).toMatch(/couldn't read/);
    }
  });

  it('refuses a format avatars are not, even one sharp reads', async () => {
    const tiff = await solid(20, 20, '#fff').tiff().toBuffer();
    const err = await rejection(cleanAvatar(tiff));
    expect(err.statusCode).toBe(400);
  });

  it('keeps the format it is asked for (the cleanup of old files)', async () => {
    const input = await phonePhoto();
    for (const format of ['jpeg', 'png', 'gif', 'webp'] as const) {
      const meta = await sharp(await cleanAvatar(input, { format })).metadata();
      expect(meta.format).toBe(format);
      expect(meta.exif).toBeUndefined();
    }
  });
});
