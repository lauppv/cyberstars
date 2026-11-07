import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import type {
  TerminalSetup,
  TerminalSessionInfo,
  TerminalExecResult,
} from '@cyberstars/shared/terminal';
import { findProject } from '@cyberstars/shared/projects';
import { PROJECTS_DIR } from '@cyberstars/content/paths';
import { AppError } from '@cyberstars-framework/server-kit/errors';
import { contentDir } from './paths.js';
import { inLine } from './run-waits.js';
import { addGuestSandboxSource, makeRoomForGuest } from './guest-sandboxes.js';
import { dockerExec, killLeftovers, SANDBOX_KEEPALIVE } from '@cyberstars-framework/sandbox/docker';
import { sandbox, SANDBOX_LABEL } from './sandbox.js';

const IMAGE = 'cyberstars-linux-sandbox';
const IDLE_TTL = 15 * 60 * 1000;
const EXEC_TIMEOUT = 5;
// Each session is a live 128 MB sandbox container, so the total must be bounded
// or a burst of /session calls OOMs the box. Mirrors the code sandbox's global cap.
const MAX_SESSIONS = Number(process.env.TERMINAL_MAX_SESSIONS ?? 50);
// A student or guest has a session per open terminal tab; past a few, a new
// one closes their oldest, so a script can't pile them up.
const MAX_SESSIONS_PER_OWNER = 3;

interface Session {
  ownerKey: string;
  containerId: string;
  cwd: string;
  history: string[];
  lastOutput: string;
  lastActivity: number;
  // The network a guest's session counts against (guest-sandboxes.ts)
  guestIp?: string;
  // The Linux project the session was started for, whose judge it answers to
  project?: string;
  // The pids of the setup's programs, spared when a command's leftovers go
  keep: string[];
}

const sessions = new Map<string, Session>();
const executing = new Set<string>();

addGuestSandboxSource((ip) =>
  [...sessions]
    .filter(([, s]) => s.guestIp === ip)
    .map(([id, s]) => ({
      lastActivity: s.lastActivity,
      busy: executing.has(id),
      close: () => void destroySession(id),
    })),
);

let gcTimer: ReturnType<typeof setInterval> | null = null;

// At the global cap, free one slot by destroying the least-recently-active
// session that isn't mid-command. A session currently executing is never
// evicted (it would kill a live command). `preferOwnerKey` recycles the
// requesting owner's own idle session first, so an owner spamming /session
// reclaims their own footprint before evicting other users' idle sessions.
function evictLruIdleSession(preferOwnerKey?: string): void {
  let lruId: string | null = null;
  let oldest = Infinity;
  for (const [id, s] of sessions) {
    if (executing.has(id)) continue;
    if (preferOwnerKey !== undefined && s.ownerKey !== preferOwnerKey) continue;
    if (s.lastActivity < oldest) {
      oldest = s.lastActivity;
      lruId = id;
    }
  }
  // No idle session owned by the requester, so fall back to the global LRU idle.
  if (!lruId && preferOwnerKey !== undefined) {
    evictLruIdleSession();
    return;
  }
  if (lruId) void destroySession(lruId);
}

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

// Translated sandbox filesystems live in a ro/ subfolder beside the English
// source (packages/content/lessons/linux/ro/<slug>-setup.json), mirroring
// lesson prose translations. English stays the source of truth; a missing RO
// variant falls back to it so a course can be translated one lesson at a time.
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

// A Linux project's starting files sit beside its steps
// (packages/content/projects/linux/<slug>-setup.json), English only like the
// project. A slug outside the catalog is a 404, so no other file is read.
export function loadProjectSetup(slug: string): TerminalSetup | null {
  if (!findProject('linux', slug)) throw new AppError(404, 'Project not found');
  const filePath = path.join(PROJECTS_DIR, 'linux', `${slug}-setup.json`);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

export function createSession(
  courseKey: string,
  lessonSlug: string,
  ownerKey: string,
  lang?: string,
  guestIp?: string,
): Promise<TerminalSessionInfo> {
  return startSession(loadSetup(courseKey, lessonSlug, lang), ownerKey, guestIp);
}

export function createProjectSession(
  slug: string,
  ownerKey: string,
  guestIp?: string,
): Promise<TerminalSessionInfo> {
  return startSession(loadProjectSetup(slug), ownerKey, guestIp, slug);
}

async function startSession(
  setup: TerminalSetup | null,
  ownerKey: string,
  guestIp?: string,
  project?: string,
): Promise<TerminalSessionInfo> {
  const cwd = setup?.cwd ?? '/home/student';

  const owned = [...sessions].filter(([, s]) => s.ownerKey === ownerKey);
  if (owned.length >= MAX_SESSIONS_PER_OWNER) void destroySession(owned[0][0]);
  if (guestIp) makeRoomForGuest(guestIp);
  // Bound total live containers before spinning up another one.
  if (sessions.size >= MAX_SESSIONS) evictLruIdleSession(ownerKey);

  // The session is counted from now on, while its container is still starting,
  // so sessions asked for together can't slip past the caps above. It counts as
  // executing until it's ready, which keeps the eviction off it.
  const sessionId = crypto.randomUUID();
  const session: Session = {
    ownerKey,
    containerId: '',
    cwd,
    history: [],
    lastOutput: '',
    lastActivity: Date.now(),
    guestIp,
    project,
    keep: [],
  };
  sessions.set(sessionId, session);
  executing.add(sessionId);

  try {
    session.containerId = await dockerExec([
      'run',
      '-d',
      '--rm',
      `--label=${SANDBOX_LABEL}`,
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
      ...SANDBOX_KEEPALIVE,
    ]);
    const { containerId } = session;
    // Closed while its container was starting (a newer session of the same
    // owner, say): the container has nobody left to remove it
    if (sessions.get(sessionId) !== session) {
      void dockerExec(['rm', '-f', containerId], 5000).catch(() => {});
      throw new Error('Session not found');
    }

    if (setup) {
      for (const dir of setup.dirs) {
        await dockerExec(['exec', containerId, 'mkdir', '-p', `/home/student/${dir}`]);
      }
      for (const file of setup.files) {
        const fullPath = file.path.startsWith('/') ? file.path : `/home/student/${file.path}`;
        const dir2 = fullPath.substring(0, fullPath.lastIndexOf('/'));
        if (dir2 && dir2 !== '/home/student') {
          await dockerExec(['exec', containerId, 'mkdir', '-p', dir2]);
        }
        await dockerExec(
          ['exec', '-i', containerId, 'bash', '-c', `cat > '${fullPath.replace(/'/g, "'\\''")}'`],
          10_000,
          file.content,
        );
      }
    }

    for (const [i, program] of (setup?.processes ?? []).entries()) {
      session.keep.push(await startProgram(containerId, i, program));
    }

    await dockerExec(['exec', '-i', containerId, 'bash', '-c', 'cat > /tmp/.cwd'], 10_000, cwd);
  } catch (err) {
    void destroySession(sessionId);
    throw err;
  } finally {
    executing.delete(sessionId);
  }

  startGC();

  return { sessionId, cwd, intro: setup?.intro };
}

// How many of the session's commands `history` lists, the newest ones
const HISTORY_SHOWN = 100;

function shellQuote(text: string): string {
  return `'${text.replace(/'/g, "'\\''")}'`;
}

// Starts one of the setup's programs: a shell reading its script from a pipe
// of its own. It runs through a link named after `cmd`'s program, so the
// process is called that (`pgrep`, `pkill`, `ps -e` and `top` go by it), and
// `exec -a` gives it `cmd` as its command line (`ps aux`). The script ignores a
// polite stop when the program is stubborn, builds a string that holds its
// memory, then reads the pipe forever and throws every line away: the student
// can write to the pipe too, and nothing they write there may run in a
// process the cleanup spares. Returns its pid.
async function startProgram(
  containerId: string,
  i: number,
  program: { cmd: string; memoryMb?: number; stubborn?: boolean },
): Promise<string> {
  const dir = `/tmp/.program${i}`;
  const base = program.cmd.trim().split(/\s+/)[0].split('/').pop() ?? '';
  const name = /^[\w.-]+$/.test(base) ? base : 'program';
  const script = [
    ...(program.stubborn ? ["trap '' TERM INT HUP"] : []),
    ...(program.memoryMb
      ? [`x=$(head -c ${Math.round(program.memoryMb * 1024 * 1024)} /dev/zero | tr '\\0' a)`]
      : []),
    'while :; do read -r _; done',
  ];
  // One exec: make the link and the pipe, start the program, print its pid,
  // then hand it its script (this exec's stdin) through the pipe
  const pid = await dockerExec(
    [
      'exec',
      '-i',
      containerId,
      'bash',
      '-c',
      `mkdir ${dir} && ln -s /bin/bash ${dir}/${name} && mkfifo ${dir}/pipe && ` +
        `{ exec -a ${shellQuote(program.cmd)} ${dir}/${name} 0<>${dir}/pipe >/dev/null 2>&1 & } && ` +
        `echo $! && cat > ${dir}/pipe`,
    ],
    10_000,
    script.join('\n') + '\n',
  );
  return pid.trim();
}

// Like killLeftovers, but sparing the setup's programs: everything else of the
// student's is stopped first, so nothing can fork while the rest is killed.
function killLeftoversBut(containerId: string, keep: string[]): Promise<void> {
  const others = `ps -o pid= -u student | while read -r p; do case " 1 $$ ${keep.join(' ')} " in *" $p "*) ;; *) echo "$p" ;; esac; done`;
  const script = `for i in 1 2 3; do kill -STOP $(${others}) 2>/dev/null; done; kill -9 $(${others}) 2>/dev/null; true`;
  return dockerExec(['exec', containerId, 'sh', '-c', script], 5_000).then(
    () => {},
    () => {},
  );
}

export async function execCommand(
  sessionId: string,
  command: string,
  ownerKey: string,
  // Where the command counts as waiting while it's in line (run-waits.ts)
  waitKey: string | null = null,
): Promise<TerminalExecResult> {
  const session = sessions.get(sessionId);
  // A mismatched owner is reported as "not found" so a leaked sessionId reveals
  // nothing about other users' sessions.
  if (!session || session.ownerKey !== ownerKey) throw new Error('Session not found');

  if (command.length > 2000) throw new Error('Command too long');
  if (executing.has(sessionId)) throw new Error('A command is already running in this session');

  executing.add(sessionId);
  try {
    // A command turned away for a busy server never ran, so it stays out of
    // the history the terminal judge reads
    const releaseSlot = await inLine(waitKey, (onWait) => sandbox.acquireSlot({ onWait }));
    session.lastActivity = Date.now();
    session.history.push(command);

    // A shell started for one command keeps no history, so the session's is
    // handed to it first, for `history` to list
    const past = session.history
      .slice(-HISTORY_SHOWN)
      .map((line) => `history -s ${shellQuote(line)}`)
      .join('\n');
    const script = `${past}\ncd "$(cat /tmp/.cwd)" && { ${command}; } 2>&1; echo $? > /tmp/.exit; pwd > /tmp/.cwd`;

    let output: string;
    try {
      // The script goes in on stdin, not as an argument, so ps shows the
      // student `bash -s` rather than their command wrapped in ours
      output = await dockerExec(
        ['exec', '-i', session.containerId, 'timeout', String(EXEC_TIMEOUT), 'bash', '-s'],
        (EXEC_TIMEOUT + 2) * 1000,
        script + '\n',
      );
    } catch (e: unknown) {
      output = e instanceof Error ? e.message : 'Command failed';
    } finally {
      // The 5s limit stops the command, not what it sent to the background
      await (session.keep.length
        ? killLeftoversBut(session.containerId, session.keep)
        : killLeftovers(session.containerId));
      releaseSlot();
    }

    let newCwd = session.cwd;
    try {
      newCwd = await dockerExec(['exec', session.containerId, 'cat', '/tmp/.cwd']);
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

export interface SessionView {
  containerId: string;
  history: string[];
  cwd: string;
  project?: string;
}

// Read-only snapshot for the state-check judge (terminal-tests.service). A
// mismatched owner returns null (reported as "not found" upstream). Reading for
// a check counts as activity so the session isn't GC'd mid-run.
export function getSessionView(sessionId: string, ownerKey: string): SessionView | null {
  const session = sessions.get(sessionId);
  if (!session || session.ownerKey !== ownerKey) return null;
  session.lastActivity = Date.now();
  return {
    containerId: session.containerId,
    history: [...session.history],
    cwd: session.cwd,
    project: session.project,
  };
}

export async function destroySession(sessionId: string, ownerKey?: string): Promise<void> {
  const session = sessions.get(sessionId);
  if (!session) return;
  // Internal callers (GC, shutdown) pass no ownerKey; a user may only destroy
  // their own session.
  if (ownerKey !== undefined && session.ownerKey !== ownerKey) return;
  sessions.delete(sessionId);
  try {
    await dockerExec(['rm', '-f', session.containerId], 5000);
  } catch {
    /* container may already be gone, or still starting (createSession removes it then) */
  }
}

export function activeCount(): number {
  return sessions.size;
}

export async function destroyAllSessions(): Promise<void> {
  const ids = [...sessions.keys()];
  await Promise.allSettled(ids.map((id) => destroySession(id)));
  if (gcTimer) {
    clearInterval(gcTimer);
    gcTimer = null;
  }
}
