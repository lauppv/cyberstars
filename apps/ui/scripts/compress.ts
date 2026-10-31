// After the pages are pre-rendered: write a Brotli and a gzip copy next to each
// of the build's text files (<file>.br, <file>.gz), so the server sends a
// browser that takes them the smaller copy (apps/api/src/middleware/static.ts)
// and never compresses anything per request on the droplet's one vCPU.
import { readdirSync, readFileSync, realpathSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { brotliCompressSync, constants, gzipSync } from 'node:zlib';
import { COMPRESSED_COPIES, COMPRESSED_FILE } from '@cyberstars/shared/compression';

// Below this a copy saves next to nothing, and about half the lesson files are this small
export const MIN_SIZE = 1024;

const compress: Record<(typeof COMPRESSED_COPIES)[number]['encoding'], (data: Buffer) => Buffer> = {
  br: (data) =>
    brotliCompressSync(data, {
      params: {
        [constants.BROTLI_PARAM_QUALITY]: constants.BROTLI_MAX_QUALITY,
        [constants.BROTLI_PARAM_SIZE_HINT]: data.length,
      },
    }),
  gzip: (data) => gzipSync(data, { level: constants.Z_BEST_COMPRESSION }),
};

// Every file worth a copy under dir, and what the copies came to. A copy that
// comes out no smaller than its file isn't written, so the server sends the file.
export function compressDir(dir: string) {
  const sizes = { files: 0, raw: 0, br: 0, gzip: 0 };
  const files = readdirSync(dir, { recursive: true, encoding: 'utf8' }).filter((file) =>
    COMPRESSED_FILE.test(file),
  );
  for (const file of files) {
    const data = readFileSync(path.join(dir, file));
    if (data.length < MIN_SIZE) continue;
    sizes.files++;
    sizes.raw += data.length;
    for (const { encoding, extension } of COMPRESSED_COPIES) {
      const copy = compress[encoding](data);
      const kept = copy.length < data.length;
      if (kept) writeFileSync(path.join(dir, file + extension), copy);
      sizes[encoding] += kept ? copy.length : data.length;
    }
  }
  return sizes;
}

const invokedPath = process.argv[1] ? realpathSync(process.argv[1]) : '';
if (invokedPath === fileURLToPath(import.meta.url)) {
  const sizes = compressDir(path.join(import.meta.dirname, '../dist'));
  const mb = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  console.log(
    `compress: ${sizes.files} files, ${mb(sizes.raw)} down to ${mb(sizes.br)} with Brotli and ${mb(sizes.gzip)} with gzip`,
  );
}
