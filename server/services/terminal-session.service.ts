import { execFile } from "child_process";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import type { TerminalSetup, TerminalSessionInfo, TerminalExecResult } from "../../shared/terminal.js";
import { contentDir } from "./paths.js";

const IMAGE = "cyberstars-linux-sandbox";
const IDLE_TTL = 15 * 60 * 1000;
const EXEC_TIMEOUT = 5;

interface Session {
  containerId: string;
  cwd: string;
  history: string[];
  lastOutput: string;
  lastActivity: number;
}

const sessions = new Map<string, Session>();

let gcTimer: ReturnType<typeof setInterval> | null = null;

function startGC() {
  if (gcTimer) return;
  gcTimer = setInterval(() => {
    const now = Date.now();
    for (const [id, s] of sessions) {
      if (now - s.lastActivity > IDLE_TTL) {
        destroySession(id).catch(() => {});
      }
    }
  }, 60_000);
  gcTimer.unref();
}

function docker(args: string[], timeout = 10_000): Promise<string> {
  return new Promise((resolve, reject) => {
    execFile("docker", args, { maxBuffer: 1024 * 1024, timeout }, (err, stdout, stderr) => {
      if (err) reject(new Error(stderr || err.message));
      else resolve(stdout.trim());
    });
  });
}

export function loadSetup(courseKey: string, lessonSlug: string): TerminalSetup | null {
  const filePath = path.join(contentDir(courseKey), `${lessonSlug}-setup.json`);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

export async function createSession(courseKey: string, lessonSlug: string): Promise<TerminalSessionInfo> {
  const setup = loadSetup(courseKey, lessonSlug);
  const cwd = setup?.cwd ?? "/home/student";

  const containerId = await docker([
    "run", "-d", "--rm",
    "--network=none",
    "--memory=128m",
    "--pids-limit=64",
    "--cpus=0.5",
    "--cap-drop=ALL",
    "--security-opt=no-new-privileges",
    "--read-only",
    "--tmpfs=/home/student:size=16m,uid=1000",
    "--tmpfs=/tmp:size=4m,uid=1000",
    IMAGE,
  ]);

  if (setup) {
    for (const dir of setup.dirs) {
      await docker(["exec", containerId, "mkdir", "-p", `/home/student/${dir}`]);
    }
    for (const file of setup.files) {
      const fullPath = file.path.startsWith("/") ? file.path : `/home/student/${file.path}`;
      const dir2 = fullPath.substring(0, fullPath.lastIndexOf("/"));
      if (dir2 && dir2 !== "/home/student") {
        await docker(["exec", containerId, "mkdir", "-p", dir2]);
      }
      await docker(["exec", containerId, "bash", "-c", `cat > ${fullPath} << 'CYBEREOF'\n${file.content}\nCYBEREOF`]);
    }
  }

  await docker(["exec", containerId, "bash", "-c", `echo '${cwd}' > /tmp/.cwd`]);

  const sessionId = crypto.randomUUID();
  sessions.set(sessionId, {
    containerId,
    cwd,
    history: [],
    lastOutput: "",
    lastActivity: Date.now(),
  });

  startGC();

  return { sessionId, cwd, intro: setup?.intro };
}

export async function execCommand(sessionId: string, command: string): Promise<TerminalExecResult> {
  const session = sessions.get(sessionId);
  if (!session) throw new Error("Session not found");

  session.lastActivity = Date.now();
  session.history.push(command);

  const script = `cd "$(cat /tmp/.cwd)" && { ${command}; } 2>&1; echo $? > /tmp/.exit; pwd > /tmp/.cwd`;

  let output: string;
  try {
    output = await docker(
      ["exec", session.containerId, "timeout", String(EXEC_TIMEOUT), "bash", "-c", script],
      (EXEC_TIMEOUT + 2) * 1000
    );
  } catch (e: unknown) {
    output = e instanceof Error ? e.message : "Command failed";
  }

  let newCwd = session.cwd;
  try {
    newCwd = await docker(["exec", session.containerId, "cat", "/tmp/.cwd"]);
  } catch {}

  session.cwd = newCwd;
  session.lastOutput = output;

  return { output, cwd: newCwd };
}

export async function probe(sessionId: string, command: string): Promise<string> {
  const session = sessions.get(sessionId);
  if (!session) throw new Error("Session not found");

  try {
    return await docker(
      ["exec", session.containerId, "bash", "-c", `cd "$(cat /tmp/.cwd)" && ${command}`],
      8000
    );
  } catch (e: unknown) {
    return e instanceof Error ? e.message : "";
  }
}

export function getSession(sessionId: string): Session | undefined {
  return sessions.get(sessionId);
}

export async function destroySession(sessionId: string): Promise<void> {
  const session = sessions.get(sessionId);
  if (!session) return;
  sessions.delete(sessionId);
  try {
    await docker(["rm", "-f", session.containerId], 5000);
  } catch {}
}
