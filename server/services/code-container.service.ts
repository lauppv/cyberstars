import { execFile } from 'child_process';
import { getRuntime } from '../runtimes/registry.js';

// One long-lived Docker container per owner (a logged-in user or a guest), on
// the language they last ran. The container is reused across many runs so the
// cold start is paid once, torn down when the owner leaves or goes idle, and
// swapped when the owner switches language. Mirrors the lifecycle approach of
// terminal-session.service.ts. Nothing here decides *what* runs in the
// container — that stays in interactive-execution.service.ts.
const IDLE_TTL = Number(process.env.CODE_CONTAINER_IDLE_MS ?? 15 * 60 * 1000);
const MAX_CONTAINERS = Number(process.env.CODE_MAX_CONTAINERS ?? 50);
const RUN_MEMORY = process.env.CODE_RUN_MEMORY ?? '128m';
const RUN_PIDS = process.env.CODE_RUN_PIDS ?? '64';

interface OwnerContainer {
  language: string;
  containerId: string;
  lastActivity: number;
  busy: boolean;
}

const containers = new Map<string, OwnerContainer>();
let gcTimer: ReturnType<typeof setInterval> | null = null;

function docker(args: string[], timeout = 10_000): Promise<string> {
  return new Promise((resolve, reject) => {
    execFile('docker', args, { maxBuffer: 1024 * 1024, timeout }, (err, stdout, stderr) => {
      if (err) reject(new Error(stderr || err.message));
      else resolve(stdout.trim());
    });
  });
}

// Hardening shared with the editor's one-shot runner: no network, dropped caps,
// read-only root with writable tmpfs scratch, and (when possible) a non-root uid.
function hardeningArgs(): string[] {
  const args = ['--cap-drop=ALL', '--security-opt=no-new-privileges', '--read-only'];
  const uid = process.getuid?.();
  const gid = process.getgid?.();
  const sandboxUser = process.env.SANDBOX_RUN_AS_USER ?? 'true';
  const asUser = uid !== undefined && gid !== undefined && sandboxUser !== 'false';
  const ownerOpt = asUser ? `,uid=${uid},gid=${gid}` : '';
  // /work is `exec` so compiled C binaries can run from it (docker tmpfs is
  // noexec by default); /tmp stays noexec — nothing is executed from there.
  args.push(`--tmpfs=/work:exec,size=64m,mode=0700${ownerOpt}`);
  args.push(`--tmpfs=/tmp:size=64m,mode=0700${ownerOpt}`);
  if (asUser) args.push(`--user=${uid}:${gid}`);
  return args;
}

function createContainer(image: string): Promise<string> {
  return docker(
    [
      'run',
      '-d',
      '--rm',
      '--network=none',
      `--memory=${RUN_MEMORY}`,
      `--pids-limit=${RUN_PIDS}`,
      ...hardeningArgs(),
      '-w',
      '/work',
      image,
      'sleep',
      'infinity',
    ],
    30_000,
  );
}

function removeContainer(containerId: string): Promise<void> {
  if (!containerId) return Promise.resolve();
  return docker(['rm', '-f', containerId], 5_000).then(
    () => {},
    () => {},
  );
}

function evictLruIdle(): void {
  let lruKey: string | null = null;
  let oldest = Infinity;
  for (const [key, c] of containers) {
    if (!c.busy && c.lastActivity < oldest) {
      oldest = c.lastActivity;
      lruKey = key;
    }
  }
  if (lruKey) {
    const c = containers.get(lruKey)!;
    containers.delete(lruKey);
    void removeContainer(c.containerId);
  }
}

function startGC(): void {
  if (gcTimer) return;
  gcTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, c] of containers) {
      if (!c.busy && now - c.lastActivity > IDLE_TTL) {
        containers.delete(key);
        void removeContainer(c.containerId);
      }
    }
  }, 60_000);
  gcTimer.unref?.();
}

// Ensure a container exists for this owner on this language and reserve it for a
// single run. Reuses the owner's container when the language matches, swaps it
// when the language changes, and throws if a run is already in progress for the
// owner (one container can only serve one run at a time).
export async function acquireForRun(ownerKey: string, language: string): Promise<string> {
  const runtime = getRuntime(language);
  if (!runtime) throw new Error('Language not supported');

  const existing = containers.get(ownerKey);
  if (existing) {
    if (existing.busy) throw new Error('A run is already in progress');
    if (existing.language === language) {
      existing.busy = true;
      existing.lastActivity = Date.now();
      return existing.containerId;
    }
    // Language switched — tear the old container down and build a fresh one.
    containers.delete(ownerKey);
    void removeContainer(existing.containerId);
  }

  if (containers.size >= MAX_CONTAINERS) evictLruIdle();

  // Reserve the slot synchronously so a concurrent acquire for the same owner
  // can't race and start a second container.
  const reserved: OwnerContainer = {
    language,
    containerId: '',
    lastActivity: Date.now(),
    busy: true,
  };
  containers.set(ownerKey, reserved);

  let containerId: string;
  try {
    containerId = await createContainer(runtime.image);
  } catch (err) {
    if (containers.get(ownerKey) === reserved) containers.delete(ownerKey);
    throw err;
  }

  // The owner may have been torn down (destroyOwner) while we were creating —
  // drop the orphan instead of leaking a container nothing tracks.
  if (containers.get(ownerKey) !== reserved) {
    void removeContainer(containerId);
    throw new Error('Run cancelled');
  }

  reserved.containerId = containerId;
  startGC();
  return containerId;
}

export function releaseAfterRun(ownerKey: string): void {
  const c = containers.get(ownerKey);
  if (c) {
    c.busy = false;
    c.lastActivity = Date.now();
  }
}

export async function destroyOwner(ownerKey: string): Promise<void> {
  const c = containers.get(ownerKey);
  if (!c) return;
  containers.delete(ownerKey);
  await removeContainer(c.containerId);
}

// Presence ref-count: each open lesson tab holds one session. The owner's
// container is torn down promptly when the last tab closes (multi-tab safe);
// the idle GC is only the backstop for sessions that never close cleanly.
const sessionRefs = new Map<string, number>();

export function openSession(ownerKey: string): void {
  sessionRefs.set(ownerKey, (sessionRefs.get(ownerKey) ?? 0) + 1);
}

export function closeSession(ownerKey: string): void {
  const remaining = (sessionRefs.get(ownerKey) ?? 0) - 1;
  if (remaining > 0) {
    sessionRefs.set(ownerKey, remaining);
  } else {
    sessionRefs.delete(ownerKey);
    void destroyOwner(ownerKey);
  }
}

export async function drainAll(): Promise<void> {
  const ids = [...containers.values()].map((c) => c.containerId);
  containers.clear();
  if (gcTimer) {
    clearInterval(gcTimer);
    gcTimer = null;
  }
  await Promise.allSettled(ids.map((id) => removeContainer(id)));
}

export function activeCount(): number {
  return containers.size;
}
