import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  // The load test's scripts run by hand (loadtest/README.md); nothing imports them
  ignore: ['e2e/**', 'loadtest/**'],
  // boot.js is loaded by a script tag in index.html before the app's bundle.
  // The web judge's runner is copied into its sandbox and run there by node.
  ignoreFiles: ['apps/ui/public/boot.js', 'apps/api/src/services/lesson-tests.runner.web.cjs'],
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
