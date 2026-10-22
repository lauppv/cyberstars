import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const root = import.meta.dirname;

const packages = fs
  .readdirSync(root, { withFileTypes: true })
  .filter((d) => d.isDirectory() && fs.existsSync(path.join(root, d.name, 'package.json')))
  .map((d) => ({
    dir: d.name,
    manifest: JSON.parse(fs.readFileSync(path.join(root, d.name, 'package.json'), 'utf8')),
  }));

describe('framework packages', () => {
  // Under the framework's own scope, and only what `exports` lists can be
  // imported, so the app can't reach a package's internals
  it('are named under @cyberstars-framework and declare their entry points', () => {
    for (const { dir, manifest } of packages) {
      expect(manifest.name, dir).toMatch(/^@cyberstars-framework\//);
      expect(manifest.exports, `${dir} declares no exports`).toBeDefined();
    }
  });
});
