// Cleans the avatars uploaded before every upload went through cleanAvatar
// (CYB-145): each file is turned the right way up, cut to a square and saved
// again without its metadata (a phone photo's EXIF can hold where it was taken).
// A file keeps its name and format, so the database needs no change.
//
//   npm run clean:avatars -w @cyberstars/api              clean them
//   npm run clean:avatars -w @cyberstars/api -- --dry-run say what would change
//
// Safe to run again: a file already clean is left alone.

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { realpathSync } from 'node:fs';
import sharp, { type Metadata } from 'sharp';
import { AVATARS_DIR } from '../src/config/paths.js';
import {
  AVATAR_SIZE,
  cleanAvatar,
  type AvatarFormat,
} from '../src/services/avatar-image.service.js';

const FORMATS = new Set<string>(['jpeg', 'png', 'webp', 'gif']);

export type CleanOutcome = 'cleaned' | 'clean' | 'skipped' | 'failed';
export type CleanReport = { file: string; outcome: CleanOutcome; reason?: string }[];

// Nothing left to take out: no metadata of any kind and no bigger than an upload is now.
function isClean(meta: Metadata): boolean {
  const height = meta.pageHeight ?? meta.height ?? 0;
  return (
    !meta.exif &&
    !meta.icc &&
    !meta.xmp &&
    !meta.iptc &&
    !meta.comments?.length &&
    !meta.orientation &&
    (meta.width ?? 0) <= AVATAR_SIZE &&
    height <= AVATAR_SIZE
  );
}

async function cleanOne(dir: string, file: string, dryRun: boolean): Promise<CleanReport[number]> {
  const full = path.join(dir, file);
  let input: Buffer;
  try {
    input = await fs.readFile(full);
  } catch (err) {
    // Replaced or removed by its owner while the script ran
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
      return { file, outcome: 'skipped', reason: 'gone' };
    }
    throw err;
  }

  let meta: Metadata;
  try {
    meta = await sharp(input, { animated: true }).metadata();
  } catch {
    return { file, outcome: 'failed', reason: 'not a picture sharp can read' };
  }
  if (!FORMATS.has(meta.format)) {
    return { file, outcome: 'failed', reason: `unexpected format ${meta.format}` };
  }
  if (isClean(meta)) return { file, outcome: 'clean' };
  if (dryRun) return { file, outcome: 'cleaned', reason: 'dry run' };

  let output: Buffer;
  try {
    // An old animation can be longer than an upload may be now; keep it whole.
    output = await cleanAvatar(input, {
      format: meta.format as AvatarFormat,
      maxFrames: Infinity,
    });
  } catch (err) {
    return { file, outcome: 'failed', reason: (err as Error).message };
  }

  // Written beside it and renamed over it, so the site never serves half a file.
  const { mode } = await fs.stat(full);
  const tmp = path.join(dir, `.${file}.tmp`);
  await fs.writeFile(tmp, output, { mode });
  await fs.rename(tmp, full);
  return { file, outcome: 'cleaned' };
}

export async function cleanAvatarsDir(dir: string, { dryRun = false } = {}): Promise<CleanReport> {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw err;
  }
  const report: CleanReport = [];
  // One at a time: the server has one CPU and the site keeps running.
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    if (!entry.isFile() || entry.name.startsWith('.')) continue;
    report.push(await cleanOne(dir, entry.name, dryRun));
  }
  return report;
}

/* v8 ignore start */
const invokedPath = process.argv[1] ? realpathSync(process.argv[1]) : '';
if (invokedPath === fileURLToPath(import.meta.url)) {
  const dryRun = process.argv.includes('--dry-run');
  const report = await cleanAvatarsDir(AVATARS_DIR, { dryRun });
  for (const r of report) {
    if (r.outcome !== 'clean')
      console.log(`${r.outcome}: ${r.file}${r.reason ? ` (${r.reason})` : ''}`);
  }
  const count = (o: CleanOutcome) => report.filter((r) => r.outcome === o).length;
  console.log(
    `${report.length} files in ${AVATARS_DIR}: ${count('cleaned')} ${dryRun ? 'to clean' : 'cleaned'}, ` +
      `${count('clean')} already clean, ${count('skipped')} skipped, ${count('failed')} failed`,
  );
  if (count('failed') > 0) process.exitCode = 1;
}
/* v8 ignore stop */
