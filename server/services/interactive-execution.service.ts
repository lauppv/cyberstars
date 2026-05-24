import { spawn, execFile } from "child_process";
import path from "path";
import os from "os";
import crypto from "crypto";
import fs from "fs/promises";
import { getRuntime } from "../runtimes/registry.js";
import type { WebSocket } from "ws";

const RUN_MEMORY = process.env.CODE_RUN_MEMORY ?? "128m";
const RUN_PIDS = process.env.CODE_RUN_PIDS ?? "64";
const RUN_DIR = process.env.CODE_RUN_DIR ?? path.join(os.tmpdir(), "cyberstars-runs");
const TIMEOUT_MS = 60_000;

export async function handleInteractiveRun(ws: WebSocket, code: string, language: string) {
  const runtime = getRuntime(language);
  if (!runtime) {
    ws.send(JSON.stringify({ type: "stderr", data: "Language not supported.\n" }));
    ws.send(JSON.stringify({ type: "exit", code: 1 }));
    return;
  }

  const runId = crypto.randomUUID();
  const hostDir = path.join(RUN_DIR, runId);
  await fs.mkdir(hostDir, { recursive: true });
  await fs.writeFile(path.join(hostDir, runtime.sourceFile), code, "utf-8");

  const cleanup = () => fs.rm(hostDir, { recursive: true, force: true }).catch(() => {});

  if (runtime.compileCmd) {
    const compileErr = await compile(hostDir, runtime.image, runtime.compileCmd);
    if (compileErr) {
      ws.send(JSON.stringify({ type: "stderr", data: compileErr }));
      ws.send(JSON.stringify({ type: "exit", code: 1 }));
      cleanup();
      return;
    }
  }

  const dockerArgs = [
    "run", "--rm", "-i",
    "--network=none",
    `--memory=${RUN_MEMORY}`,
    `--pids-limit=${RUN_PIDS}`,
    "-v", `${hostDir}:/work`,
    "-w", "/work",
    runtime.image,
    "sh", "-c", runtime.runCmd,
  ];

  const proc = spawn("docker", dockerArgs);

  let timer: ReturnType<typeof setTimeout>;
  const resetTimer = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      ws.send(JSON.stringify({ type: "stderr", data: "\nExecution timed out.\n" }));
      proc.kill("SIGKILL");
    }, TIMEOUT_MS);
  };
  resetTimer();

  proc.stdout.on("data", (chunk: Buffer) => {
    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify({ type: "stdout", data: chunk.toString() }));
    }
  });

  proc.stderr.on("data", (chunk: Buffer) => {
    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify({ type: "stderr", data: chunk.toString() }));
    }
  });

  proc.on("close", (exitCode) => {
    clearTimeout(timer);
    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify({ type: "exit", code: exitCode ?? 0 }));
    }
    cleanup();
  });

  const onMessage = (raw: Buffer | string) => {
    const msg = typeof raw === "string" ? raw : raw.toString();
    try {
      const parsed = JSON.parse(msg) as { type: string; data?: string };
      if (parsed.type === "stdin" && parsed.data != null && !proc.killed) {
        proc.stdin.write(parsed.data);
        resetTimer();
      }
    } catch { /* ignore non-JSON */ }
  };

  ws.on("message", onMessage);

  ws.on("close", () => {
    clearTimeout(timer);
    if (!proc.killed) proc.kill("SIGKILL");
    cleanup();
  });
}

function compile(hostDir: string, image: string, compileCmd: string): Promise<string | null> {
  return new Promise((resolve) => {
    const args = [
      "run", "--rm",
      "--network=none",
      "-v", `${hostDir}:/work`,
      "-w", "/work",
      image,
      "sh", "-c", compileCmd,
    ];
    execFile("docker", args, { maxBuffer: 1024 * 1024, timeout: 15_000 }, (err, _stdout, stderr) => {
      if (err) {
        resolve(stderr || err.message);
      } else {
        resolve(null);
      }
    });
  });
}
