import type { LanguageRuntime } from "./types.js";

export const pythonRuntime: LanguageRuntime = {
  name: "python",
  image: "python:3.10-slim",
  pistonVersion: "3.10.0",
  sourceFile: "user_code.py",
  innerCmd:
    "timeout 5 python3 /work/user_code.py < /work/stdin.txt > /work/output.txt 2>&1",
};
