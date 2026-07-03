import { execFile } from 'child_process';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import type {
  TerminalSetup,
  TerminalSessionInfo,
  TerminalExecResult,
} from '../../shared/terminal.js';
import { contentDir } from './paths.js';

const IMAGE = 'cyberstars-linux-sandbox';
const IDLE_TTL = 15 * 60 * 1000;
const EXEC_TIMEOUT = 5;

interface Session {
  ownerKey: string;
  containerId: string;
  cwd: string;
  history: string[];
  lastOutput: string;
  lastActivity: number;
}

const sessions = new Map<string, Session>();
const executing = new Set<string>();

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

function docker(args: string[], timeout = 10_000, stdin?: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const proc = execFile(
      'docker',
      args,
      { maxBuffer: 1024 * 1024, timeout },
      (err, stdout, stderr) => {
        if (err) reject(new Error(stderr || err.message));
        else resolve(stdout.trim());
      },
    );
    if (stdin != null) {
      proc.stdin?.end(stdin);
    }
  });
}

// Translated sandbox filesystems live in a ro/ subfolder beside the English
// source (server/lessons/linux/ro/<slug>-setup.json), mirroring lesson prose
// translations. English stays the source of truth; a missing RO variant falls
// back to it so a course can be translated one lesson at a time.
export function loadSetup(
  courseKey: string,
  lessonSlug: string,
  lang?: string,
): TerminalSetup | null {
  const base = contentDir(courseKey);
  if (lang === 'ro') {
    const roPath = path.join(base, 'ro', `${lessonSlug}-setup.json`);
    if (fs.existsSync(roPath)) return JSON.parse(fs.readFileSync(roPath, 'utf-8'));
  }
  const filePath = path.join(base, `${lessonSlug}-setup.json`);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

export async function createSession(
  courseKey: string,
  lessonSlug: string,
  ownerKey: string,
  lang?: string,
): Promise<TerminalSessionInfo> {
  const setup = loadSetup(courseKey, lessonSlug, lang);
  const cwd = setup?.cwd ?? '/home/student';

  const containerId = await docker([
    'run',
    '-d',
    '--rm',
    '--network=none',
    '--memory=128m',
    '--pids-limit=64',
    '--cpus=0.5',
    '--cap-drop=ALL',
    '--security-opt=no-new-privileges',
    '--read-only',
    '--tmpfs=/home/student:size=16m,mode=0777',
    '--tmpfs=/tmp:size=4m,mode=0777',
    IMAGE,
  ]);

  if (setup) {
    for (const dir of setup.dirs) {
      await docker(['exec', containerId, 'mkdir', '-p', `/home/student/${dir}`]);
    }
    for (const file of setup.files) {
      const fullPath = file.path.startsWith('/') ? file.path : `/home/student/${file.path}`;
      const dir2 = fullPath.substring(0, fullPath.lastIndexOf('/'));
      if (dir2 && dir2 !== '/home/student') {
        await docker(['exec', containerId, 'mkdir', '-p', dir2]);
      }
      await docker(
        ['exec', '-i', containerId, 'bash', '-c', `cat > '${fullPath.replace(/'/g, "'\\''")}'`],
        10_000,
        file.content,
      );
    }
  }

  await docker(['exec', '-i', containerId, 'bash', '-c', 'cat > /tmp/.cwd'], 10_000, cwd);

  const sessionId = crypto.randomUUID();
  sessions.set(sessionId, {
    ownerKey,
    containerId,
    cwd,
    history: [],
    lastOutput: '',
    lastActivity: Date.now(),
  });

  startGC();

  return { sessionId, cwd, intro: setup?.intro };
}

export async function execCommand(
  sessionId: string,
  command: string,
  ownerKey: string,
): Promise<TerminalExecResult> {
  const session = sessions.get(sessionId);
  // A mismatched owner is reported as "not found" so a leaked sessionId reveals
  // nothing about other users' sessions.
  if (!session || session.ownerKey !== ownerKey) throw new Error('Session not found');

  if (command.length > 2000) throw new Error('Command too long');
  if (executing.has(sessionId)) throw new Error('A command is already running in this session');

  executing.add(sessionId);
  try {
    session.lastActivity = Date.now();
    session.history.push(command);

    const script = `cd "$(cat /tmp/.cwd)" && { ${command}; } 2>&1; echo $? > /tmp/.exit; pwd > /tmp/.cwd`;

    let output: string;
    try {
      output = await docker(
        ['exec', session.containerId, 'timeout', String(EXEC_TIMEOUT), 'bash', '-c', script],
        (EXEC_TIMEOUT + 2) * 1000,
      );
    } catch (e: unknown) {
      output = e instanceof Error ? e.message : 'Command failed';
    }

    let newCwd = session.cwd;
    try {
      newCwd = await docker(['exec', session.containerId, 'cat', '/tmp/.cwd']);
    } catch {
      /* cwd read is best-effort */
    }

    session.cwd = newCwd;
    session.lastOutput = output;

    return { output, cwd: newCwd };
  } finally {
    executing.delete(sessionId);
  }
}

export async function destroySession(sessionId: string, ownerKey?: string): Promise<void> {
  const session = sessions.get(sessionId);
  if (!session) return;
  // Internal callers (GC, shutdown) pass no ownerKey; a user may only destroy
  // their own session.
  if (ownerKey !== undefined && session.ownerKey !== ownerKey) return;
  sessions.delete(sessionId);
  try {
    await docker(['rm', '-f', session.containerId], 5000);
  } catch {
    /* container may already be gone */
  }
}

export async function destroyAllSessions(): Promise<void> {
  const ids = [...sessions.keys()];
  await Promise.allSettled(ids.map((id) => destroySession(id)));
  if (gcTimer) {
    clearInterval(gcTimer);
    gcTimer = null;
  }
}
