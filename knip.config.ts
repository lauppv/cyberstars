import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  ignore: ['e2e/**'],
  // A global augmentation of Express.Request: the compiler reads it, nothing imports it.
  // boot.js is loaded by a script tag in index.html before the app's bundle.
  ignoreFiles: ['server/types/express.d.ts', 'apps/ui/public/boot.js'],
  workspaces: {
    '.': {},
    // A package's exports count as public API, so knip would stop reporting
    // shared's unused exports. Only the app imports it: check them anyway.
    'packages/shared': { includeEntryExports: true },
  },
};

export default config;
