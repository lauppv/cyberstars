import dotenv from 'dotenv';
import { defineConfig } from 'prisma/config';
import { ENV_FILE } from './src/config/paths.js';

dotenv.config({ path: ENV_FILE });

export default defineConfig({
  schema: 'prisma/schema.prisma',
});
