import type { LanguageRuntime } from './types.js';

// Programs run here are short-lived, so JVM startup dominates a run. C1-only
// JIT and the serial GC start noticeably faster under the fractional CPU cap;
// a judge that starts Java programs, or a JVM of its own, can use them too.
export const FAST_START = '-XX:TieredStopAtLevel=1 -XX:+UseSerialGC';
export const FAST_START_JAVAC = '-J-XX:TieredStopAtLevel=1 -J-XX:+UseSerialGC';

export const javaRuntime: LanguageRuntime = {
  name: 'java',
  image: 'eclipse-temurin:21-jdk-alpine',
  sourceFile: 'Main.java',
  compileCmd: `javac ${FAST_START_JAVAC} /work/Main.java -d /work`,
  runCmd: `stdbuf -o0 java ${FAST_START} -cp /work Main`,
  // Room for two JVMs at once, a judge's runner (with javac in its process)
  // and the program it runs: in 128m the program gets OOM-killed.
  memory: '256m',
};
