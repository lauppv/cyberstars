import fs from 'fs';
import path from 'path';
import type { Request, Response } from 'express';
import { isAppOnlyPath } from '@cyberstars/shared/routes';

// Every public page is built ahead as <build>/<address>.html by the UI's
// scripts/prerender.tsx, in English and under /ro, each with its own title and
// content for search engines. An address the app only draws inside the app
// (sign-in, the account, the forum) gets the app and stays out of search
// results. Anything else is a real 404, so a typo or a removed lesson never
// looks to Google like an empty page that exists.
export function servePages(buildDir: string) {
  const shell = path.join(buildDir, 'index.html');
  return (req: Request, res: Response) => {
    const address = req.path.replace(/\/+$/, '') || '/';
    const page = address === '/' ? shell : path.join(buildDir, `${address}.html`);
    if (fs.existsSync(page)) {
      res.sendFile(page);
      return;
    }
    res.set('X-Robots-Tag', 'noindex');
    const bare = address === '/ro' ? '/' : address.replace(/^\/ro\//, '/');
    if (!isAppOnlyPath(bare)) res.status(404);
    res.sendFile(shell);
  };
}
