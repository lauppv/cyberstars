import { getRuntime } from '../runtimes/registry.js';
import { dockerExec, SANDBOX_KEEPALIVE, SANDBOX_LABEL } from './docker-exec.js';
import { addGuestSandboxSource, makeRoomForGuest } from './guest-sandboxes.js';

// One long-lived Docker container per owner (a logged-in user or a guest), on
// the language they last ran. The container is reused across many runs so the
// cold start is paid once, torn down when the owner leaves or goes idle, and
// swapped when the owner switches language. Mirrors the lifecycle approach of
// terminal-session.service.ts. Nothing here decides *what* runs in the
// container; that stays in interactive-execution.service.ts.
const IDLE_TTL = Number(process.env.CODE_CONTAINER_IDLE_MS ?? 15 * 60 * 1000);
const MAX_CONTAINERS = Number(process.env.CODE_MAX_CONTAINERS ?? 50);
const RUN_MEMORY = process.env.CODE_RUN_MEMORY ?? '128m';
const RUN_PIDS = process.env.CODE_RUN_PIDS ?? '64';
const RUN_CPUS = process.env.CODE_RUN_CPUS ?? '0.5';

interface OwnerContainer {
  language: string;
  containerId: string;
  lastActivity: number;
  busy: boolean;
  // The network a guest's container counts against (guest-sandboxes.ts)
  guestIp?: string;
}

const containers = new Map<string, OwnerContainer>();

addGuestSandboxSource((ip) =>
  [...containers]
    .filter(([, c]) => c.guestIp === ip)
    .map(([key, c]) => ({
      lastActivity: c.lastActivity,
      busy: c.busy,
      close: () => void destroyOwner(key),
    })),
);
let gcTimer: ReturnType<typeof setInterval> | null = null;

// Hardening shared with the editor's one-shot runner: no network, dropped caps,
// read-only root with writable tmpfs scratch, and a fixed non-root uid. The uid
// is our own, not the API's, since the API runs as root on the VPS. Rootless
// Podman turns it off: there root inside is the developer on the host
function hardeningArgs(): string[] {
  const args = ['--cap-drop=ALL', '--security-opt=no-new-privileges', '--read-only'];
  const uid = process.env.SANDBOX_UID ?? '10001';
  const asUser = process.env.SANDBOX_RUN_AS_USER !== 'false';
  const ownerOpt = asUser ? `,uid=${uid},gid=${uid}` : '';
  // /work is `exec` so compiled C binaries can run from it (docker tmpfs is
  // noexec by default); /tmp stays noexec, since nothing is executed from there.
  args.push(`--tmpfs=/work:exec,size=64m,mode=0700${ownerOpt}`);
  args.push(`--tmpfs=/tmp:size=64m,mode=0700${ownerOpt}`);
  if (asUser) args.push(`--user=${uid}:${uid}`);
  return args;
}

function createContainer(image: string, memory?: string): Promise<string> {
  return dockerExec(
    [
      'run',
      '-d',
      '--rm',
      SANDBOX_LABEL,
      '--network=none',
      `--memory=${memory ?? RUN_MEMORY}`,
      `--pids-limit=${RUN_PIDS}`,
      `--cpus=${RUN_CPUS}`,
      ...hardeningArgs(),
      '-w',
      '/work',
      image,
      ...SANDBOX_KEEPALIVE,
    ],
    30_000,
  );
}

function removeContainer(containerId: string): Promise<void> {
  if (!containerId) return Promise.resolve();
  return dockerExec(['rm', '-f', containerId], 5_000).then(
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
// owner (one container can only serve one run at a time). A guest passes their
// network, which a new container counts against.
export async function acquireForRun(
  ownerKey: string,
  language: string,
  guestIp?: string,
): Promise<string> {
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
    // Language switched, so tear the old container down and build a fresh one.
    containers.delete(ownerKey);
    void removeContainer(existing.containerId);
  } else if (guestIp) {
    makeRoomForGuest(guestIp);
  }

  if (containers.size >= MAX_CONTAINERS) evictLruIdle();

  // Reserve the slot synchronously so a concurrent acquire for the same owner
  // can't race and start a second container.
  const reserved: OwnerContainer = {
    language,
    containerId: '',
    lastActivity: Date.now(),
    busy: true,
    guestIp,
  };
  containers.set(ownerKey, reserved);

  let containerId: string;
  try {
    containerId = await createContainer(runtime.image, runtime.memory);
  } catch (err) {
    if (containers.get(ownerKey) === reserved) containers.delete(ownerKey);
    throw err;
  }

  // The owner may have been torn down (destroyOwner) while we were creating,
  // so drop the orphan instead of leaking a container nothing tracks.
  if (containers.get(ownerKey) !== reserved) {
    void removeContainer(containerId);
    throw new Error('Run cancelled');
  }

  reserved.containerId = containerId;
  startGC();
  return containerId;
}

// Whether one of the owner's runs is using their container right now. A second
// run asks first, so it's refused at once instead of waiting in line for a
// sandbox slot only to hear it then.
export function isRunning(ownerKey: string): boolean {
  return containers.get(ownerKey)?.busy ?? false;
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

// Browsers with a tab open and nobody signed in, so the admin page can count the guests online
export function onlineGuests(): number {
  let guests = 0;
  for (const ownerKey of sessionRefs.keys()) if (!ownerKey.startsWith('user:')) guests++;
  return guests;
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

// Snapshot of the in-memory code-execution load for the admin dashboard. No
// runs are persisted, so this reflects only the current instant.
export interface CodeExecMetrics {
  activeContainers: number;
  runningNow: number;
  maxContainers: number;
  openSessions: number;
  perLanguage: Record<string, number>;
}

export function liveMetrics(): CodeExecMetrics {
  const perLanguage: Record<string, number> = {};
  let runningNow = 0;
  for (const c of containers.values()) {
    perLanguage[c.language] = (perLanguage[c.language] ?? 0) + 1;
    if (c.busy) runningNow++;
  }
  return {
    activeContainers: containers.size,
    runningNow,
    maxContainers: MAX_CONTAINERS,
    openSessions: sessionRefs.size,
    perLanguage,
  };
}
