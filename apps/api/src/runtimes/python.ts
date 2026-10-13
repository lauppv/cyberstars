import type { LanguageRuntime } from './types.js';

export const pythonRuntime: LanguageRuntime = {
  name: 'python',
  image: 'python:3.10-slim',
  sourceFile: 'user_code.py',
  runCmd: 'python3 -u /work/user_code.py',
};
