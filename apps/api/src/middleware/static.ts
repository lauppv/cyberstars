import fs from 'fs';
import path from 'path';
import express, { type RequestHandler, type Response } from 'express';
import { COMPRESSED_COPIES, COMPRESSED_FILE } from '@cyberstars/shared/compression';

const isFile = (file: string) =>
  fs.promises.stat(file).then(
    (stat) => stat.isFile(),
    () => false,
  );

// The UI's built files, everything with an extension that isn't an API route
// or a page (servePages). The build leaves a Brotli and a gzip copy next to
// each text file (apps/ui/scripts/compress.ts), and a browser that takes one
// gets it, so nothing is compressed per request. API answers never come
// through here: compressing a response that carries a secret next to something
// the visitor sent is what BREACH reads.
export function serveStatic(root: string): RequestHandler[] {
  // Vite names every file under assets/ after what it holds, so a file there
  // never changes and the browser keeps it a year without asking. The rest
  // keep their names across deploys and stay asked for on every visit, which
  // costs a 304 while they're unchanged.
  const assets = path.join(root, 'assets') + path.sep;
  const setHeaders = (res: Response, file: string) => {
    if (file.startsWith(assets)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  };

  const sendCopy: RequestHandler = async (req, res, next) => {
    if ((req.method !== 'GET' && req.method !== 'HEAD') || !COMPRESSED_FILE.test(req.path)) {
      next();
      return;
    }
    let address: string;
    try {
      address = decodeURIComponent(req.path);
    } catch {
      next();
      return;
    }
    const file = path.join(root, address);
    if (!file.startsWith(root + path.sep)) {
      next();
      return;
    }
    res.vary('Accept-Encoding');
    // Best copy first, whatever order the browser lists them in: Chrome sends
    // `gzip, deflate, br, zstd`, and taking the first it names would never send Brotli
    for (const { encoding, extension } of COMPRESSED_COPIES) {
      if (req.acceptsEncodings(encoding) !== encoding) continue;
      if (!(await isFile(file + extension))) continue;
      res.setHeader('Content-Encoding', encoding);
      // The type of the file it stands for, not of a .br or .gz
      res.type(path.extname(file));
      setHeaders(res, file);
      // Under root, so a folder above it whose name starts with a dot doesn't count as a dotfile
      res.sendFile(address + extension, { root });
      return;
    }
    next();
  };

  return [sendCopy, express.static(root, { setHeaders })];
}
