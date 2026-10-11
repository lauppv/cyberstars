import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  ignoreDependencies: ['@tailwindcss/typography', 'autoprefixer', 'postcss'],
  ignore: ['e2e/**'],
  // A global augmentation of Express.Request: the compiler reads it, nothing imports it.
  ignoreFiles: ['server/types/express.d.ts'],
};

export default config;
