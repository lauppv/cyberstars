import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { javaRuntime, pythonRuntime } from './languages/index.js';

const { execFileMock } = vi.hoisted(() => ({ execFileMock: vi.fn() }));

vi.mock('child_process', () => {
  const execFile = (...args: unknown[]) => execFileMock(...args);
  return { execFile, default: { execFile } };
});

const { createPool } = await import('./pool.js');

// Small global cap + short idle TTL so the capacity/GC paths are easy to drive.
const OPTIONS = {
  languages: { python: pythonRuntime, java: javaRuntime },
  label: 'test.sandbox',
  idleMs: 1000,
  maxContainers: 2,
  memory: '128m',
  pids: '64',
  cpus: '0.5',
  uid: '10001',
} as const;

let pool: ReturnType<typeof createPool>;

type DockerCb = (err: Error | null, stdout: string, stderr: string) => void;

// Default docker stub: `run` hands back a fresh container id, everything else ''.
let counter = 0;
function installDockerMock() {
  counter = 0;
  execFileMock.mockImplementation((_cmd: string, args: string[], _opts: unknown, cb: DockerCb) => {
    if (args[0] === 'run') cb(null, `container-${++counter}\n`, '');
    else cb(null, '', '');
  });
}

function dockerCalls(): string[][] {
  return execFileMock.mock.calls.map((c) => c[1] as string[]);
}

beforeEach(() => {
  vi.clearAllMocks();
  installDockerMock();
  pool = createPool(OPTIONS);
});

afterEach(async () => {
  await pool.drainAll();
});

describe('acquireForRun', () => {
  it('creates a hardened, detached container on first run and returns its id', async () => {
    const id = await pool.acquireForRun('user:1', 'python');
    expect(id).toBe('container-1');
    const run = dockerCalls().find((a) => a[0] === 'run')!;
    expect(run).toEqual(
      expect.arrayContaining(['-d', '--label=test.sandbox', '--network=none', '--cap-drop=ALL']),
    );
    expect(run).toContain('python:3.10-slim');
    expect(run.slice(-3)).toEqual(['sh', '-c', 'while :; do sleep 3600; done']);
  });

  it('reuses the same container for the same owner and language', async () => {
    const first = await pool.acquireForRun('user:2', 'python');
    pool.releaseAfterRun('user:2');
    const second = await pool.acquireForRun('user:2', 'python');
    expect(second).toBe(first);
    expect(dockerCalls().filter((a) => a[0] === 'run')).toHaveLength(1);
  });

  it('swaps the container when the owner switches language', async () => {
    const py = await pool.acquireForRun('user:3', 'python');
    pool.releaseAfterRun('user:3');
    const java = await pool.acquireForRun('user:3', 'java');
    expect(java).not.toBe(py);
    expect(dockerCalls().find((a) => a[0] === 'rm')).toContain(py);
    expect(dockerCalls().filter((a) => a[0] === 'run')).toHaveLength(2);
  });

  it('rejects a second run while one is already in progress for the owner', async () => {
    await pool.acquireForRun('user:4', 'python'); // not released → still busy
    await expect(pool.acquireForRun('user:4', 'python')).rejects.toThrow('already in progress');
  });

  it('says whether an owner has a run in progress', async () => {
    expect(pool.isRunning('user:busy')).toBe(false);
    await pool.acquireForRun('user:busy', 'python');
    expect(pool.isRunning('user:busy')).toBe(true);
    pool.releaseAfterRun('user:busy');
    expect(pool.isRunning('user:busy')).toBe(false);
  });

  it('rejects an unsupported language without touching state', async () => {
    await expect(pool.acquireForRun('user:5', 'cobol')).rejects.toThrow('not supported');
    expect(pool.activeCount()).toBe(0);
  });

  it('propagates a docker failure and registers no container', async () => {
    execFileMock.mockImplementation((_c: string, args: string[], _o: unknown, cb: DockerCb) => {
      if (args[0] === 'run') cb(new Error('boom'), '', 'docker: boom');
      else cb(null, '', '');
    });
    await expect(pool.acquireForRun('user:6', 'python')).rejects.toThrow();
    expect(pool.activeCount()).toBe(0);
  });

  it('falls back to the error message when docker writes nothing to stderr', async () => {
    execFileMock.mockImplementation((_c: string, args: string[], _o: unknown, cb: DockerCb) => {
      if (args[0] === 'run') cb(new Error('exec format error'), '', '');
      else cb(null, '', '');
    });
    await expect(pool.acquireForRun('user:6b', 'python')).rejects.toThrow('exec format error');
  });

  it('runs as the fixed sandbox user even when the API itself is root', async () => {
    const getuid = vi.spyOn(process, 'getuid').mockReturnValue(0);
    try {
      await pool.acquireForRun('user:root', 'python');
      const run = dockerCalls().find((a) => a[0] === 'run')!;
      expect(run).toContain('--user=10001:10001');
      expect(run).toContain('--tmpfs=/work:exec,size=64m,mode=0700,uid=10001,gid=10001');
      expect(run).toContain('--tmpfs=/tmp:size=64m,mode=0700,uid=10001,gid=10001');
    } finally {
      getuid.mockRestore();
    }
  });

  it('runs as the uid it is given', async () => {
    pool = createPool({ ...OPTIONS, uid: '20002' });
    await pool.acquireForRun('user:uid', 'python');
    const run = dockerCalls().find((a) => a[0] === 'run')!;
    expect(run).toContain('--user=20002:20002');
    expect(run.some((arg) => arg.includes('uid=20002,gid=20002'))).toBe(true);
  });

  it('omits the --user flag and tmpfs owner option when not running as a sandbox user', async () => {
    pool = createPool({ ...OPTIONS, uid: false });
    await pool.acquireForRun('user:nouser', 'python');
    const run = dockerCalls().find((a) => a[0] === 'run')!;
    expect(run.some((arg) => arg.startsWith('--user='))).toBe(false);
    expect(run.some((arg) => arg.includes('uid='))).toBe(false);
  });

  it('caps every container, giving a language its own memory when it has one', async () => {
    await pool.acquireForRun('user:py', 'python');
    await pool.acquireForRun('user:java', 'java');
    const [python, java] = dockerCalls().filter((a) => a[0] === 'run');
    expect(python).toEqual(
      expect.arrayContaining(['--memory=128m', '--pids-limit=64', '--cpus=0.5']),
    );
    expect(java).toEqual(
      expect.arrayContaining(['--memory=256m', '--pids-limit=64', '--cpus=0.5']),
    );
    expect(java).toContain('eclipse-temurin:21-jdk-alpine');
  });

  it("knows only the languages it was given, not an object's own keys", () => {
    expect(pool.runtimeOf('python')).toBe(pythonRuntime);
    expect(pool.runtimeOf('c')).toBeNull();
    expect(pool.runtimeOf('constructor')).toBeNull();
  });

  it('creates past the cap when every tracked container is busy (nothing to evict)', async () => {
    await pool.acquireForRun('user:busy1', 'python'); // busy, not released
    await pool.acquireForRun('user:busy2', 'python'); // busy, not released, at cap (2)
    await pool.acquireForRun('user:busy3', 'python'); // no idle to evict → grows to 3
    expect(pool.activeCount()).toBe(3);
    expect(dockerCalls().filter((a) => a[0] === 'rm')).toHaveLength(0);
  });

  it('does not delete the slot in the catch path when the owner was already torn down', async () => {
    let failRun!: () => void;
    execFileMock.mockImplementation((_c: string, args: string[], _o: unknown, cb: DockerCb) => {
      if (args[0] === 'run') failRun = () => cb(new Error('boom'), '', '');
      else cb(null, '', '');
    });
    const pending = pool.acquireForRun('user:catch', 'python');
    await pool.destroyOwner('user:catch'); // removes the reserved slot mid-creation
    failRun(); // now the create rejects
    await expect(pending).rejects.toThrow('boom');
    expect(pool.activeCount()).toBe(0);
  });

  it('evicts the least-recently-used idle container at the global cap', async () => {
    const a = await pool.acquireForRun('user:a', 'python');
    pool.releaseAfterRun('user:a');
    await pool.acquireForRun('user:b', 'python');
    pool.releaseAfterRun('user:b');
    // Cap is 2; a third owner evicts the LRU idle one (user:a).
    await pool.acquireForRun('user:c', 'python');
    pool.releaseAfterRun('user:c');
    expect(pool.activeCount()).toBe(2);
    expect(dockerCalls().some((x) => x[0] === 'rm' && x.includes(a))).toBe(true);
  });

  it('does not leak a container if the owner is destroyed mid-creation', async () => {
    let finishRun!: () => void;
    execFileMock.mockImplementation((_c: string, args: string[], _o: unknown, cb: DockerCb) => {
      if (args[0] === 'run') finishRun = () => cb(null, 'late-container\n', '');
      else cb(null, '', '');
    });
    const pending = pool.acquireForRun('user:race', 'python');
    await pool.destroyOwner('user:race'); // torn down while still creating
    finishRun();
    await expect(pending).rejects.toThrow('cancelled');
    expect(dockerCalls().some((a) => a[0] === 'rm' && a.includes('late-container'))).toBe(true);
    expect(pool.activeCount()).toBe(0);
  });
});

describe('destroyOwner', () => {
  it('removes the container and a later run starts a fresh one', async () => {
    const id = await pool.acquireForRun('user:d', 'python');
    pool.releaseAfterRun('user:d');
    await pool.destroyOwner('user:d');
    expect(dockerCalls().some((a) => a[0] === 'rm' && a.includes(id))).toBe(true);
    const next = await pool.acquireForRun('user:d', 'python');
    expect(next).not.toBe(id);
  });

  it('is a no-op for an unknown owner', async () => {
    await expect(pool.destroyOwner('user:none')).resolves.toBeUndefined();
  });
});

describe('releaseAfterRun', () => {
  it('is a harmless no-op when the owner has no container', () => {
    expect(() => pool.releaseAfterRun('user:ghost')).not.toThrow();
  });
});

describe('session ref-counting', () => {
  it('destroys the container only when the last session closes', async () => {
    const id = await pool.acquireForRun('user:s', 'python');
    pool.releaseAfterRun('user:s');
    pool.openSession('user:s');
    pool.openSession('user:s'); // two tabs open
    pool.closeSession('user:s'); // one tab closes
    expect(pool.activeCount()).toBe(1); // container still alive for the other tab
    pool.closeSession('user:s'); // last tab closes
    expect(pool.activeCount()).toBe(0);
    expect(dockerCalls().some((a) => a[0] === 'rm' && a.includes(id))).toBe(true);
  });

  it('closing a session with no container is a harmless no-op', () => {
    pool.openSession('user:empty');
    expect(() => pool.closeSession('user:empty')).not.toThrow();
    expect(() => pool.closeSession('user:empty')).not.toThrow(); // already at zero
  });

  it('lists each owner with a session open, once, until their last one closes', () => {
    pool.openSession('guest:a');
    pool.openSession('guest:a'); // two tabs, one browser
    pool.openSession('user:5');
    expect(pool.sessionOwners()).toEqual(['guest:a', 'user:5']);
    pool.closeSession('guest:a');
    expect(pool.sessionOwners()).toEqual(['guest:a', 'user:5']);
    pool.closeSession('guest:a');
    pool.closeSession('user:5');
    expect(pool.sessionOwners()).toEqual([]);
  });
});

describe('groups', () => {
  it('asks before a new container for an owner in a group, not before a reuse or a swap', async () => {
    const beforeNew = vi.fn();
    pool = createPool({ ...OPTIONS, beforeNew });
    await pool.acquireForRun('guest:a', 'python', '1.2.3.4');
    expect(beforeNew).toHaveBeenCalledWith('1.2.3.4');
    pool.releaseAfterRun('guest:a');
    await pool.acquireForRun('guest:a', 'python', '1.2.3.4');
    pool.releaseAfterRun('guest:a');
    await pool.acquireForRun('guest:a', 'java', '1.2.3.4');
    expect(beforeNew).toHaveBeenCalledTimes(1);
  });

  it('asks nothing for an owner in no group', async () => {
    const beforeNew = vi.fn();
    pool = createPool({ ...OPTIONS, beforeNew });
    await pool.acquireForRun('user:1', 'python');
    expect(beforeNew).not.toHaveBeenCalled();
  });

  it('starts nothing when the group refuses the new container', async () => {
    pool = createPool({
      ...OPTIONS,
      beforeNew: () => {
        throw new Error('too many');
      },
    });
    await expect(pool.acquireForRun('guest:a', 'python', '1.2.3.4')).rejects.toThrow('too many');
    expect(pool.activeCount()).toBe(0);
    expect(dockerCalls().some((a) => a[0] === 'run')).toBe(false);
  });

  it("lists a group's containers, busy or idle, and closes one on request", async () => {
    pool = createPool({ ...OPTIONS, maxContainers: 10 });
    const idle = await pool.acquireForRun('guest:a', 'python', '1.2.3.4');
    pool.releaseAfterRun('guest:a');
    await pool.acquireForRun('guest:b', 'python', '1.2.3.4');
    await pool.acquireForRun('guest:c', 'python', '5.6.7.8');

    const held = pool.held('1.2.3.4');
    expect(held.map((c) => c.busy)).toEqual([false, true]);
    expect(pool.held('9.9.9.9')).toEqual([]);

    held[0].close();
    await vi.waitFor(() =>
      expect(dockerCalls().some((a) => a[0] === 'rm' && a.includes(idle))).toBe(true),
    );
    expect(pool.held('1.2.3.4')).toHaveLength(1);
  });
});

describe('liveMetrics', () => {
  it('counts the containers, the busy ones, the sessions and each language right now', async () => {
    await pool.acquireForRun('user:1', 'python');
    pool.releaseAfterRun('user:1');
    await pool.acquireForRun('user:2', 'java');
    pool.openSession('user:1');
    expect(pool.liveMetrics()).toEqual({
      activeContainers: 2,
      runningNow: 1,
      maxContainers: 2,
      openSessions: 1,
      perLanguage: { python: 1, java: 1 },
    });
    pool.closeSession('user:1');
  });
});

describe('idle GC', () => {
  it('garbage-collects containers idle past the TTL', async () => {
    vi.useFakeTimers();
    try {
      await pool.acquireForRun('user:gc', 'python');
      pool.releaseAfterRun('user:gc');
      expect(pool.activeCount()).toBe(1);
      vi.advanceTimersByTime(61_000); // GC ticks every 60s; idle TTL is 1s here
      expect(pool.activeCount()).toBe(0);
    } finally {
      vi.useRealTimers();
    }
  });

  it('leaves a busy container alone even after the idle TTL elapses', async () => {
    vi.useFakeTimers();
    try {
      await pool.acquireForRun('user:gc-busy', 'python'); // never released → stays busy
      vi.advanceTimersByTime(61_000);
      expect(pool.activeCount()).toBe(1); // busy containers are skipped by the GC
    } finally {
      vi.useRealTimers();
    }
  });
});
