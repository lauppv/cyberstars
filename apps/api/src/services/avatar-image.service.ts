import sharp, { type Metadata } from 'sharp';
import { AppError } from '@cyberstars-framework/server-kit/errors';

// Avatars show at 80px at most, so 256 stays sharp on a 3x screen.
export const AVATAR_SIZE = 256;

// A 2 MB PNG or GIF can unpack into a huge picture. 40 million pixels (all the
// frames of an animation together) still fits any phone photo under 2 MB.
const MAX_PIXELS = 40_000_000;

// Each frame costs a resize and an encode, and the server has one CPU: 100
// frames take well under a second, 2000 tiny ones took 9 seconds.
export const MAX_FRAMES = 100;

const FORMATS = new Set(['jpeg', 'png', 'webp', 'gif']);
export type AvatarFormat = 'jpeg' | 'png' | 'webp' | 'gif';

// Avatars are few and small; don't keep decoded pictures in memory between them.
sharp.cache(false);

// What sharp throws on a picture we can't take, said to the student
function refusal(err: unknown): AppError {
  if (err instanceof Error && /pixel limit/i.test(err.message)) {
    return new AppError(400, 'This picture is too big. Try a smaller one.');
  }
  return new AppError(400, "We couldn't read this picture. Try another one.");
}

/**
 * Re-encodes an avatar: turned the right way up, cut to a square, and with no
 * metadata left (the EXIF of a phone photo can hold where it was taken).
 * Animations stay animated. Uploads become WebP; `format` lets the one-off
 * cleanup keep a file's own format so its name doesn't change.
 */
export async function cleanAvatar(
  input: Buffer,
  { format = 'webp', maxFrames = MAX_FRAMES }: { format?: AvatarFormat; maxFrames?: number } = {},
): Promise<Buffer> {
  const open = () => sharp(input, { animated: true, limitInputPixels: MAX_PIXELS });

  let meta: Metadata;
  try {
    meta = await open().metadata();
  } catch (err) {
    throw refusal(err);
  }
  if (!FORMATS.has(meta.format)) throw refusal(null);
  const frames = meta.pages ?? 1;
  if (frames > maxFrames) {
    throw new AppError(
      400,
      `This animated picture is too long. Pick one with at most ${maxFrames} frames.`,
    );
  }

  let image = open();
  // sharp can't turn an animation by 90 degrees. Only a phone photo carries the
  // orientation that matters here, and a photo is never animated.
  if (frames === 1) image = image.autoOrient();
  image = image.resize(AVATAR_SIZE, AVATAR_SIZE, { fit: 'cover' });

  // sharp writes no metadata unless asked to (no keepMetadata/withMetadata), and
  // turns colour profiles into plain sRGB first, so the colours stay right.
  if (format === 'webp') image = image.webp({ quality: 85 });
  else if (format === 'jpeg') image = image.jpeg({ quality: 85, mozjpeg: true });
  else if (format === 'png') image = image.png();
  else image = image.gif();

  try {
    return await image.toBuffer();
  } catch (err) {
    throw refusal(err);
  }
}
