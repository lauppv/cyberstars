import type { KnipConfig } from "knip";

const config: KnipConfig = {
  ignore: ["design/**"],
  ignoreDependencies: [
    "@tailwindcss/typography",
    "autoprefixer",
    "postcss",
  ],
};

export default config;
