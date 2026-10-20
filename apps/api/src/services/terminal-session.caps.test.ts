import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// The per-owner and per-network caps, with docker mocked like in
// terminal-session.eviction.test.ts and the global cap left at its default.
const { execFileMock } = vi.hoisted(() => ({ execFileMock: vi.fn() }));

vi.mock('child_process', () => {
  const execFile = (...args: unknown[]) => execFileMock(...args);
  return { execFile, default: { execFile } };
});

const { createSession, getSessionView, activeCount, destroyAllSessions } =
  await import('./terminal-session.service.js');

type DockerCb = (err: Error | null, stdout: string, stderr: string) => void;

// `docker run` answers on a later tick, like the real one, so sessions asked
// for together are all still starting at once.
let counter = 0;
function installDockerMock() {
  counter = 0;
  execFileMock.mockImplementation((_cmd: string, args: string[], _opts: unknown, cb: DockerCb) => {
    if (args[0] === 'run') {
      const id = `container-${++counter}`;
      setImmediate(() => cb(null, `${id}\n`, ''));
    } else cb(null, '', '');
  });
}

function removed(): string[] {
  return execFileMock.mock.calls
    .map((c) => c[1] as string[])
    .filter((a) => a[0] === 'rm')
    .map((a) => a[2]);
}

async function newSession(owner: string) {
  return createSession('linux', 'no-such-lesson-xyz', owner);
}

beforeEach(() => {
  vi.clearAllMocks();
  installDockerMock();
});

afterEach(async () => {
  await destroyAllSessions();
});

describe('sessions per owner', () => {
  it('closes the oldest of three when a fourth opens', async () => {
    const first = await newSession('user:o');
    await newSession('user:o');
    await newSession('user:o');
    expect(activeCount()).toBe(3);

    await newSession('user:o');
    expect(activeCount()).toBe(3);
    expect(getSessionView(first.sessionId, 'user:o')).toBeNull();
    expect(removed()).toEqual(['container-1']);
  });

  it("leaves other owners' sessions alone", async () => {
    const other = await newSession('user:x');
    for (let i = 0; i < 4; i++) await newSession('user:o');
    expect(getSessionView(other.sessionId, 'user:x')).not.toBeNull();
  });

  it('counts sessions still starting, so a burst ends with three', async () => {
    const results = await Promise.allSettled([1, 2, 3, 4, 5].map(() => newSession('user:b')));

    expect(activeCount()).toBe(3);
    // The two oldest were closed while their containers were starting, and
    // those containers are removed rather than left behind
    expect(results.filter((r) => r.status === 'rejected')).toHaveLength(2);
    expect(removed()).toEqual(expect.arrayContaining(['container-1', 'container-2']));
  });
});
