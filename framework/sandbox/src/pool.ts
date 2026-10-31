import { dockerExec, SANDBOX_KEEPALIVE } from './docker.js';
import type { LanguageRuntime } from './languages/types.js';

export interface PoolOptions {
  // The languages code runs in, by the name a run asks for
  languages: Record<string, LanguageRuntime>;
  // A Docker label every container carries, so a later run of the server can
  // find the ones it no longer tracks (removeStraySandboxes)
  label: string;
  // An idle container goes after this long without a run
  idleMs: number;
  // At this many containers, a new one first removes the least recently used
  // idle one
  maxContainers: number;
  // Each container's caps, as Docker takes them; a language may set its own
  // memory
  memory: string;
  pids: string;
  cpus: string;
  // The fixed uid code runs as, never the server's own, which may be root.
  // False keeps the image's user, for rootless Podman: there root inside the
  // container is the developer outside it
  uid: string | false;
  // Called before a new container for an owner in a group (a guest's network,
  // say). It may close some of the group's idle containers (`held`) or throw
  // to refuse the new one
  beforeNew?: (group: string) => void;
}

// A container as its owner's group sees it
export interface HeldContainer {
  lastActivity: number;
  busy: boolean;
  close: () => void;
}

interface OwnerContainer {
  language: string;
  containerId: string;
  lastActivity: number;
  busy: boolean;
  group?: string;
}

// Hardening every container gets: no capabilities and no way to gain any, a
// read-only root with writable tmpfs scratch, and a fixed uid
function hardeningArgs(uid: string | false): string[] {
  const args = ['--cap-drop=ALL', '--security-opt=no-new-privileges', '--read-only'];
  const ownerOpt = uid === false ? '' : `,uid=${uid},gid=${uid}`;
  // /work is `exec` so compiled C binaries can run from it (docker tmpfs is
  // noexec by default); /tmp stays noexec, since nothing is executed from there.
  args.push(`--tmpfs=/work:exec,size=64m,mode=0700${ownerOpt}`);
  args.push(`--tmpfs=/tmp:size=64m,mode=0700${ownerOpt}`);
  if (uid !== false) args.push(`--user=${uid}:${uid}`);
  return args;
}

function removeContainer(containerId: string): Promise<void> {
  if (!containerId) return Promise.resolve();
  return dockerExec(['rm', '-f', containerId], 5_000).then(
    () => {},
    () => {},
  );
}

// One long-lived Docker container per owner, on the language they last ran.
// The container is reused across many runs so the cold start is paid once,
// torn down when the owner leaves or goes idle, and swapped when the owner
// switches language. Nothing here decides *what* runs in the container; that
// is the live run's (live-run.ts) or the app's own, such as a judge.
export function createPool(options: PoolOptions) {
  const containers = new Map<string, OwnerContainer>();
  let gcTimer: ReturnType<typeof setInterval> | null = null;

  // The language's definition, or null for one the app doesn't run
  function runtimeOf(language: string): LanguageRuntime | null {
    return Object.hasOwn(options.languages, language) ? options.languages[language] : null;
  }

  function createContainer(runtime: LanguageRuntime): Promise<string> {
    return dockerExec(
      [
        'run',
        '-d',
        '--rm',
        `--label=${options.label}`,
        '--network=none',
        `--memory=${runtime.memory ?? options.memory}`,
        `--pids-limit=${options.pids}`,
        `--cpus=${options.cpus}`,
        ...hardeningArgs(options.uid),
        '-w',
        '/work',
        runtime.image,
        ...SANDBOX_KEEPALIVE,
      ],
      30_000,
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
        if (!c.busy && now - c.lastActivity > options.idleMs) {
          containers.delete(key);
          void removeContainer(c.containerId);
        }
      }
    }, 60_000);
    gcTimer.unref?.();
  }

  // Ensure a container exists for this owner on this language and reserve it
  // for a single run. Reuses the owner's container when the language matches,
  // swaps it when the language changes, and throws if a run is already in
  // progress for the owner (one container can only serve one run at a time).
  // An owner in a group passes it, and a new container counts against it.
  async function acquireForRun(
    ownerKey: string,
    language: string,
    group?: string,
  ): Promise<string> {
    const runtime = runtimeOf(language);
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
    } else if (group) {
      options.beforeNew?.(group);
    }

    if (containers.size >= options.maxContainers) evictLruIdle();

    // Reserve the slot synchronously so a concurrent acquire for the same owner
    // can't race and start a second container.
    const reserved: OwnerContainer = {
      language,
      containerId: '',
      lastActivity: Date.now(),
      busy: true,
      group,
    };
    containers.set(ownerKey, reserved);

    let containerId: string;
    try {
      containerId = await createContainer(runtime);
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

  // Whether one of the owner's runs is using their container right now. A
  // second run asks first, so it's refused at once instead of waiting in line
  // for a sandbox slot only to hear it then.
  function isRunning(ownerKey: string): boolean {
    return containers.get(ownerKey)?.busy ?? false;
  }

  function releaseAfterRun(ownerKey: string): void {
    const c = containers.get(ownerKey);
    if (c) {
      c.busy = false;
      c.lastActivity = Date.now();
    }
  }

  async function destroyOwner(ownerKey: string): Promise<void> {
    const c = containers.get(ownerKey);
    if (!c) return;
    containers.delete(ownerKey);
    await removeContainer(c.containerId);
  }

  // The containers a group's owners hold, busy or idle, each with a way to
  // close it
  function held(group: string): HeldContainer[] {
    return [...containers]
      .filter(([, c]) => c.group === group)
      .map(([key, c]) => ({
        lastActivity: c.lastActivity,
        busy: c.busy,
        close: () => void destroyOwner(key),
      }));
  }

  // Presence ref-count: each open page holds one session. The owner's
  // container is torn down promptly when the last one closes (multi-tab
  // safe); the idle GC is only the backstop for sessions that never close
  // cleanly.
  const sessionRefs = new Map<string, number>();

  function openSession(ownerKey: string): void {
    sessionRefs.set(ownerKey, (sessionRefs.get(ownerKey) ?? 0) + 1);
  }

  function closeSession(ownerKey: string): void {
    const remaining = (sessionRefs.get(ownerKey) ?? 0) - 1;
    if (remaining > 0) {
      sessionRefs.set(ownerKey, remaining);
    } else {
      sessionRefs.delete(ownerKey);
      void destroyOwner(ownerKey);
    }
  }

  // The owners with a session open, once each
  function sessionOwners(): string[] {
    return [...sessionRefs.keys()];
  }

  async function drainAll(): Promise<void> {
    const ids = [...containers.values()].map((c) => c.containerId);
    containers.clear();
    if (gcTimer) {
      clearInterval(gcTimer);
      gcTimer = null;
    }
    await Promise.allSettled(ids.map((id) => removeContainer(id)));
  }

  // Snapshot of the load right now, for an admin page. No run is kept, so
  // this reflects only the current instant.
  function liveMetrics() {
    const perLanguage: Record<string, number> = {};
    let runningNow = 0;
    for (const c of containers.values()) {
      perLanguage[c.language] = (perLanguage[c.language] ?? 0) + 1;
      if (c.busy) runningNow++;
    }
    return {
      activeContainers: containers.size,
      runningNow,
      maxContainers: options.maxContainers,
      openSessions: sessionRefs.size,
      perLanguage,
    };
  }

  return {
    runtimeOf,
    acquireForRun,
    isRunning,
    releaseAfterRun,
    destroyOwner,
    held,
    openSession,
    closeSession,
    sessionOwners,
    drainAll,
    liveMetrics,
  };
}

export type Pool = ReturnType<typeof createPool>;
