import type { LanguageRuntime } from './types.js';

export const kotlinRuntime: LanguageRuntime = {
  name: 'kotlin',
  image: 'danysk/kotlin:latest',
  sourceFile: 'Main.kt',
  compileCmd: 'kotlinc -include-runtime -d /work/Main.jar /work/Main.kt',
  runCmd: 'stdbuf -o0 java -jar /work/Main.jar',
  memory: '512m',
  // Uncapped: kotlinc -include-runtime is too heavy for the default 0.5-CPU cap
  // (compile blows past the e2e timeout on slower CI runners).
  cpus: null,
};
