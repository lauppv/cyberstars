import type { LanguageRuntime } from './types.js';

export const cRuntime: LanguageRuntime = {
  name: 'c',
  image: 'gcc:latest',
  pistonVersion: '10.2.0',
  sourceFile: 'user_code.c',
  innerCmd:
    'gcc -Wall -lm -lpthread /work/user_code.c -o /work/a.out > /work/output.txt 2>&1 && ' +
    'timeout 5 /work/a.out < /work/stdin.txt >> /work/output.txt 2>&1',
  compileCmd: 'gcc -Wall -lm -lpthread /work/user_code.c -o /work/a.out',
  runCmd: 'stdbuf -o0 /work/a.out',
};
