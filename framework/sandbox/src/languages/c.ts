import type { LanguageRuntime } from './types.js';

export const cRuntime: LanguageRuntime = {
  name: 'c',
  // A fixed version, so students get the compiler we tested, not whatever
  // gcc:latest was the day the server pulled it. The judge's C runner needs
  // the python3 this image ships. To move to a newer gcc, see CLAUDE.md
  // (Production): every place naming the tag changes with it.
  image: 'gcc:16.1.0',
  sourceFile: 'user_code.c',
  compileCmd: 'gcc -Wall -lm -lpthread /work/user_code.c -o /work/a.out',
  runCmd: 'stdbuf -o0 /work/a.out',
};
