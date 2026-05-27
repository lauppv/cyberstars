import { describe, it, expect, vi, afterEach } from 'vitest';
import { execSync } from 'child_process';

const { mockExistsSync, mockReadFileSync } = vi.hoisted(() => ({
  mockExistsSync: vi.fn(),
  mockReadFileSync: vi.fn(),
}));

vi.mock('fs', async (importOriginal) => {
  const actual = await importOriginal<typeof import('fs')>();
  const patched = {
    ...actual,
    existsSync: (...args: unknown[]) => mockExistsSync(...args),
    readFileSync: (...args: unknown[]) => mockReadFileSync(...args),
  };
  return { ...patched, default: patched };
});

const { loadSetup, createSession, execCommand, probe, getSession, destroySession } =
  await import('./terminal-session.service.js');

function dockerAvailable(): boolean {
  try {
    execSync('docker image inspect cyberstars-linux-sandbox', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

const hasDocker = dockerAvailable();
const itDocker = hasDocker ? it : it.skip;

const sessionsToClean: string[] = [];
afterEach(async () => {
  for (const id of sessionsToClean.splice(0)) {
    await destroySession(id);
  }
});

describe('loadSetup', () => {
  it('returns null when setup file does not exist', () => {
    mockExistsSync.mockReturnValue(false);
    expect(loadSetup('linux', 'nonexistent')).toBeNull();
  });

  it('returns parsed JSON when file exists', () => {
    mockExistsSync.mockReturnValue(true);
    mockReadFileSync.mockReturnValue(
      JSON.stringify({ cwd: '/home/student/docs', dirs: [], files: [] }),
    );
    const setup = loadSetup('linux', 'test-lesson');
    expect(setup).toEqual({ cwd: '/home/student/docs', dirs: [], files: [] });
  });
});

describe('createSession', () => {
  itDocker('creates a session and returns session info', async () => {
    mockExistsSync.mockReturnValue(false);
    const info = await createSession('linux', 'test');
    sessionsToClean.push(info.sessionId);
    expect(info.sessionId).toBeDefined();
    expect(info.cwd).toBe('/home/student');
    expect(getSession(info.sessionId)).toBeDefined();
  });
});

describe('execCommand', () => {
  it('throws for unknown session', async () => {
    await expect(execCommand('no-such-session', 'ls')).rejects.toThrow('Session not found');
  });

  itDocker('throws for command too long', async () => {
    mockExistsSync.mockReturnValue(false);
    const { sessionId } = await createSession('linux', 'test');
    sessionsToClean.push(sessionId);
    await expect(execCommand(sessionId, 'x'.repeat(2001))).rejects.toThrow('Command too long');
  });

  itDocker('returns output and updated cwd', async () => {
    mockExistsSync.mockReturnValue(false);
    const { sessionId } = await createSession('linux', 'test');
    sessionsToClean.push(sessionId);

    const result = await execCommand(sessionId, 'echo hello');
    expect(result.output).toContain('hello');
    expect(result.cwd).toBe('/home/student');
  });

  itDocker('tracks cwd across commands', async () => {
    mockExistsSync.mockReturnValue(false);
    const { sessionId } = await createSession('linux', 'test');
    sessionsToClean.push(sessionId);

    await execCommand(sessionId, 'cd /tmp');
    const result = await execCommand(sessionId, 'pwd');
    expect(result.cwd).toBe('/tmp');
  });
});

describe('probe', () => {
  it('throws for unknown session', async () => {
    await expect(probe('no-such-session', 'pwd')).rejects.toThrow('Session not found');
  });

  itDocker('returns probe output', async () => {
    mockExistsSync.mockReturnValue(false);
    const { sessionId } = await createSession('linux', 'test');
    sessionsToClean.push(sessionId);

    const result = await probe(sessionId, 'echo probed');
    expect(result).toContain('probed');
  });
});

describe('getSession / destroySession', () => {
  it('getSession returns undefined for unknown session', () => {
    expect(getSession('nope')).toBeUndefined();
  });

  itDocker('destroySession removes session', async () => {
    mockExistsSync.mockReturnValue(false);
    const { sessionId } = await createSession('linux', 'test');
    expect(getSession(sessionId)).toBeDefined();

    await destroySession(sessionId);
    expect(getSession(sessionId)).toBeUndefined();
  });

  it('destroySession is no-op for unknown session', async () => {
    await expect(destroySession('nope')).resolves.toBeUndefined();
  });
});
