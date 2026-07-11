import type { LanguageRuntime } from './types.js';

export const javaRuntime: LanguageRuntime = {
  name: 'java',
  image: 'eclipse-temurin:21-jdk-alpine',
  sourceFile: 'Main.java',
  compileCmd: 'javac /work/Main.java -d /work',
  runCmd: 'stdbuf -o0 java -cp /work Main',
  // The lesson judge holds two JVMs at once (runner with in-process javac +
  // the judged program) — the 128m default gets the child OOM-killed.
  memory: '256m',
};
