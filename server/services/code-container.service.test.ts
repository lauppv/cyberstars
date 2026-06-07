import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Small global cap + short idle TTL so the capacity/GC paths are easy to drive.
process.env.CODE_MAX_CONTAINERS = '2';
process.env.CODE_CONTAINER_IDLE_MS = '1000';

const { execFileMock } = vi.hoisted(() => ({ execFileMock: vi.fn() }));

vi.mock('child_process', () => {
  const execFile = (...args: unknown[]) => execFileMock(...args);
  return { execFile, default: { execFile } };
});

const {
  acquireForRun,
  releaseAfterRun,
  destroyOwner,
  drainAll,
  activeCount,
  openSession,
  closeSession,
} = await import('./code-container.service.js');

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
});

afterEach(async () => {
  await drainAll();
});

describe('acquireForRun', () => {
  it('creates a hardened, detached container on first run and returns its id', async () => {
    const id = await acquireForRun('user:1', 'python');
    expect(id).toBe('container-1');
    const run = dockerCalls().find((a) => a[0] === 'run')!;
    expect(run).toEqual(expect.arrayContaining(['-d', '--network=none', '--cap-drop=ALL']));
    expect(run).toContain('--cpus=0.5');
    expect(run).toContain('python:3.10-slim');
    expect(run).toEqual(expect.arrayContaining(['sleep', 'infinity']));
  });

  it('reuses the same container for the same owner and language', async () => {
    const first = await acquireForRun('user:2', 'python');
    releaseAfterRun('user:2');
    const second = await acquireForRun('user:2', 'python');
    expect(second).toBe(first);
    expect(dockerCalls().filter((a) => a[0] === 'run')).toHaveLength(1);
  });

  it('swaps the container when the owner switches language', async () => {
    const py = await acquireForRun('user:3', 'python');
    releaseAfterRun('user:3');
    const java = await acquireForRun('user:3', 'java');
    expect(java).not.toBe(py);
    expect(dockerCalls().find((a) => a[0] === 'rm')).toContain(py);
    expect(dockerCalls().filter((a) => a[0] === 'run')).toHaveLength(2);
  });

  it('rejects a second run while one is already in progress for the owner', async () => {
    await acquireForRun('user:4', 'python'); // not released → still busy
    await expect(acquireForRun('user:4', 'python')).rejects.toThrow('already in progress');
  });

  it('rejects an unsupported language without touching state', async () => {
    await expect(acquireForRun('user:5', 'cobol')).rejects.toThrow('not supported');
    expect(activeCount()).toBe(0);
  });

  it('propagates a docker failure and registers no container', async () => {
    execFileMock.mockImplementation((_c: string, args: string[], _o: unknown, cb: DockerCb) => {
      if (args[0] === 'run') cb(new Error('boom'), '', 'docker: boom');
      else cb(null, '', '');
    });
    await expect(acquireForRun('user:6', 'python')).rejects.toThrow();
    expect(activeCount()).toBe(0);
  });

  it('evicts the least-recently-used idle container at the global cap', async () => {
    const a = await acquireForRun('user:a', 'python');
    releaseAfterRun('user:a');
    await acquireForRun('user:b', 'python');
    releaseAfterRun('user:b');
    // Cap is 2; a third owner evicts the LRU idle one (user:a).
    await acquireForRun('user:c', 'python');
    releaseAfterRun('user:c');
    expect(activeCount()).toBe(2);
    expect(dockerCalls().some((x) => x[0] === 'rm' && x.includes(a))).toBe(true);
  });

  it('does not leak a container if the owner is destroyed mid-creation', async () => {
    let finishRun!: () => void;
    execFileMock.mockImplementation((_c: string, args: string[], _o: unknown, cb: DockerCb) => {
      if (args[0] === 'run') finishRun = () => cb(null, 'late-container\n', '');
      else cb(null, '', '');
    });
    const pending = acquireForRun('user:race', 'python');
    await destroyOwner('user:race'); // torn down while still creating
    finishRun();
    await expect(pending).rejects.toThrow('cancelled');
    expect(dockerCalls().some((a) => a[0] === 'rm' && a.includes('late-container'))).toBe(true);
    expect(activeCount()).toBe(0);
  });
});

describe('destroyOwner', () => {
  it('removes the container and a later run starts a fresh one', async () => {
    const id = await acquireForRun('user:d', 'python');
    releaseAfterRun('user:d');
    await destroyOwner('user:d');
    expect(dockerCalls().some((a) => a[0] === 'rm' && a.includes(id))).toBe(true);
    const next = await acquireForRun('user:d', 'python');
    expect(next).not.toBe(id);
  });

  it('is a no-op for an unknown owner', async () => {
    await expect(destroyOwner('user:none')).resolves.toBeUndefined();
  });
});

describe('session ref-counting', () => {
  it('destroys the container only when the last session closes', async () => {
    const id = await acquireForRun('user:s', 'python');
    releaseAfterRun('user:s');
    openSession('user:s');
    openSession('user:s'); // two tabs open
    closeSession('user:s'); // one tab closes
    expect(activeCount()).toBe(1); // container still alive for the other tab
    closeSession('user:s'); // last tab closes
    expect(activeCount()).toBe(0);
    expect(dockerCalls().some((a) => a[0] === 'rm' && a.includes(id))).toBe(true);
  });

  it('closing a session with no container is a harmless no-op', () => {
    openSession('user:empty');
    expect(() => closeSession('user:empty')).not.toThrow();
    expect(() => closeSession('user:empty')).not.toThrow(); // already at zero
  });
});

describe('idle GC', () => {
  it('garbage-collects containers idle past the TTL', async () => {
    vi.useFakeTimers();
    try {
      await acquireForRun('user:gc', 'python');
      releaseAfterRun('user:gc');
      expect(activeCount()).toBe(1);
      vi.advanceTimersByTime(61_000); // GC ticks every 60s; idle TTL is 1s here
      expect(activeCount()).toBe(0);
    } finally {
      vi.useRealTimers();
    }
  });
});
