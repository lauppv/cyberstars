import type { LanguageRuntime } from "./types.js";

export const cRuntime: LanguageRuntime = {
  name: "c",
  image: "gcc:14",
  pistonVersion: "10.2.0",
  sourceFile: "user_code.c",
  // Compilez întâi, dacă pică oprim aici, altfel rulăm binarul cu timeout
  innerCmd:
    "gcc -Wall -lm -lpthread /work/user_code.c -o /work/a.out > /work/output.txt 2>&1 && " +
    "timeout 5 /work/a.out < /work/stdin.txt >> /work/output.txt 2>&1",
};
