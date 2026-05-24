import type { LanguageRuntime } from "./types.js";

export const javaRuntime: LanguageRuntime = {
  name: "java",
  image: "eclipse-temurin:21-jdk-alpine",
  pistonVersion: "15.0.2",
  sourceFile: "Main.java",
  innerCmd:
    "javac /work/Main.java -d /work > /work/output.txt 2>&1 && " +
    "timeout 5 java -cp /work Main < /work/stdin.txt >> /work/output.txt 2>&1",
  compileCmd: "javac /work/Main.java -d /work",
  runCmd: "stdbuf -o0 java -cp /work Main",
};
