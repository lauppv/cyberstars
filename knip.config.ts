import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  ignoreDependencies: ['@tailwindcss/typography', 'autoprefixer', 'postcss'],
  ignore: ['e2e/**'],
  // A global augmentation of Express.Request: the compiler reads it, nothing imports it.
  ignoreFiles: ['server/types/express.d.ts'],
  workspaces: {
    '.': {},
    // A package's exports count as public API, so knip would stop reporting
    // shared's unused exports. Only the app imports it: check them anyway.
    'packages/shared': { includeEntryExports: true },
  },
};

export default config;
