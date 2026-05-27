import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  ignoreDependencies: ['@tailwindcss/typography', 'autoprefixer', 'postcss'],
  ignore: ['e2e/**'],
};

export default config;
