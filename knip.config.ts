import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  ignore: ['e2e/**'],
  // boot.js is loaded by a script tag in index.html before the app's bundle.
  ignoreFiles: ['apps/ui/public/boot.js'],
  workspaces: {
    '.': {},
    // A package's exports count as public API, so knip would stop reporting
    // shared's unused exports. Only the app imports it: check them anyway.
    'packages/shared': { includeEntryExports: true },
    // Tests aren't part of what a framework package ships
    'framework/*': { project: ['src/**/*.ts!', '!src/**/*.test.ts!'] },
  },
};

export default config;
