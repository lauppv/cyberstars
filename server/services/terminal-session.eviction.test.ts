import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Small global cap so the capacity/eviction path is easy to drive. Mocking
// child_process (docker's execFile) lets createSession run without a real
// sandbox image — unlike terminal-session.service.test.ts which needs Docker.
process.env.TERMINAL_MAX_SESSIONS = '2';

const { execFileMock } = vi.hoisted(() => ({ execFileMock: vi.fn() }));

vi.mock('child_process', () => {
  const execFile = (...args: unknown[]) => execFileMock(...args);
  return { execFile, default: { execFile } };
});

const { createSession, execCommand, activeCount, destroyAllSessions } =
  await import('./terminal-session.service.js');

type DockerCb = (err: Error | null, stdout: string, stderr: string) => void;

let counter = 0;
function installDockerMock() {
  counter = 0;
  execFileMock.mockImplementation((_cmd: string, args: string[], _opts: unknown, cb: DockerCb) => {
    if (args[0] === 'run') cb(null, `container-${++counter}\n`, '');
    else cb(null, '', '');
  });
}

// A slug with no *-setup.json → loadSetup returns null, so no dirs/files probes.
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

describe('global session cap', () => {
  it('evicts the least-recently-active idle session at the cap', async () => {
    const a = await newSession('user:a');
    await newSession('user:b');
    expect(activeCount()).toBe(2);

    // A third owner is at the cap; user:a is the LRU idle one and gets evicted.
    await newSession('user:c');
    expect(activeCount()).toBe(2);

    await expect(execCommand(a.sessionId, 'echo hi', 'user:a')).rejects.toThrow(
      'Session not found',
    );
  });

  it('recycles the requesting owner’s own idle session before other owners’', async () => {
    const a1 = await newSession('user:a');
    await newSession('user:a'); // a now owns both slots
    expect(activeCount()).toBe(2);

    // user:a hits the cap again — their own oldest idle session is reclaimed,
    // never another owner's.
    await newSession('user:a');
    expect(activeCount()).toBe(2);

    await expect(execCommand(a1.sessionId, 'echo hi', 'user:a')).rejects.toThrow(
      'Session not found',
    );
  });
});
