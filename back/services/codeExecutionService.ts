import { exec } from "child_process";
import path from "path";
import crypto from "crypto";
import fs from "fs/promises";
import { config } from "../config.js";

const PISTON_URL = "https://emkc.org/api/v2/piston/execute";

const pistonVersions: Record<string, string> = {
  python: "3.10.0",
  c: "10.2.0",
  java: "15.0.2",
};

interface PistonResponse {
  run?: { output?: string };
}

export async function execute(code: string, language: string, stdin = ""): Promise<string> {
  const lang = language.toLowerCase();

  if (config.isProduction) {
    return executePiston(code, lang, stdin);
  }
  return executeDocker(code, lang, stdin);
}

async function executePiston(code: string, lang: string, stdin = ""): Promise<string> {
  const version = pistonVersions[lang];
  if (!version) return "Language not supported.";

  try {
    const response = await fetch(PISTON_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: lang,
        version,
        files: [{ name: "main", content: code }],
        stdin,
        args: [],
        compile_timeout: 10000,
        run_timeout: 5000,
        compile_memory_limit: -1,
        run_memory_limit: -1,
      }),
    });

    const data = (await response.json()) as PistonResponse;
    return (data.run?.output || "").trim() || "No output.";
  } catch {
    return "Error connecting to execution server.";
  }
}

async function executeDocker(code: string, lang: string, stdin = ""): Promise<string> {
  const runId = crypto.randomUUID();
  const runtimePath = path.join(process.cwd(), "back", "runtimes", lang, runId);
  await fs.mkdir(runtimePath, { recursive: true });

  const outputFile = path.join(runtimePath, "output.txt");
  const stdinFile = path.join(runtimePath, "stdin.txt");
  await fs.writeFile(outputFile, "", "utf-8");
  await fs.writeFile(stdinFile, stdin, "utf-8");

  let dockerCmd: string;

  switch (lang) {
    case "python": {
      const srcFile = path.join(runtimePath, "user_code.py");
      await fs.writeFile(srcFile, code, "utf-8");
      dockerCmd = `docker run --rm -v ${runtimePath}:/usr/src/app python-runtime sh -c "timeout 5 python3 /usr/src/app/user_code.py < /usr/src/app/stdin.txt > /usr/src/app/output.txt 2>&1"`;
      break;
    }
    case "c": {
      const srcFile = path.join(runtimePath, "user_code.c");
      await fs.writeFile(srcFile, code, "utf-8");
      dockerCmd = `docker run --rm -v ${runtimePath}:/usr/src/app gcc:12.2.0 bash -c "timeout 5 bash -c 'gcc /usr/src/app/user_code.c -o /usr/src/app/a.out > /usr/src/app/output.txt 2>&1 && /usr/src/app/a.out >> /usr/src/app/output.txt 2>&1'"`;
      break;
    }
    case "java": {
      const srcFile = path.join(runtimePath, "Main.java");
      await fs.writeFile(srcFile, code, "utf-8");
      dockerCmd = `docker run --rm -v ${runtimePath}:/usr/src/app openjdk:20 bash -c "timeout 5 bash -c 'javac /usr/src/app/Main.java -d /usr/src/app > /usr/src/app/output.txt 2>&1 && java -cp /usr/src/app Main >> /usr/src/app/output.txt 2>&1'"`;
      break;
    }
    default:
      return "Language not supported.";
  }

  return new Promise<string>((resolve) => {
    exec(dockerCmd, { maxBuffer: 1024 * 1024 }, async () => {
      try {
        const output = await fs.readFile(outputFile, "utf-8");
        resolve(output.trim() || "No output.");
      } catch {
        resolve("Error reading output file.");
      } finally {
        fs.rm(runtimePath, { recursive: true, force: true }).catch(() => {});
      }
    });
  });
}
