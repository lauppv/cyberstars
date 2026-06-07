// Transpile the TypeScript server (server/ + shared/) to plain ESM JavaScript in
// dist-server/, so production runs `node dist-server/server/server.js` instead of
// paying tsx's on-the-fly transpile cost (and RAM) on every boot.
//
// This is transpile-only — esbuild strips types without type-checking, exactly
// like tsx (which is itself built on esbuild) does at runtime today. It is NOT a
// bundler run: each file maps 1:1 to an output file and keeps its `.js` import
// specifiers, so the module graph (incl. ../shared/*) resolves unchanged at runtime.
import { build } from 'esbuild';
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

function collectTsFiles(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules') continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      collectTsFiles(full, out);
    } else if (name.endsWith('.ts') && !name.endsWith('.test.ts') && !name.endsWith('.d.ts')) {
      out.push(full);
    }
  }
  return out;
}

const entryPoints = [...collectTsFiles('server'), ...collectTsFiles('shared')];

build({
  entryPoints,
  outdir: 'dist-server',
  outbase: '.',
  format: 'esm',
  platform: 'node',
  target: 'node24',
  bundle: false,
  sourcemap: false,
  logLevel: 'info',
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
