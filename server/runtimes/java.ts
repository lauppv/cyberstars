import type { LanguageRuntime } from './types.js';

export const javaRuntime: LanguageRuntime = {
  name: 'java',
  image: 'eclipse-temurin:21-jdk-alpine',
  sourceFile: 'Main.java',
  compileCmd: 'javac /work/Main.java -d /work',
  runCmd: 'stdbuf -o0 java -cp /work Main',
};
