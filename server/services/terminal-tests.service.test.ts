import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest';
import fs from 'fs';
import path from 'path';

const { mockDockerExec, mockGetSessionView } = vi.hoisted(() => ({
  mockDockerExec: vi.fn(),
  mockGetSessionView: vi.fn(),
}));

vi.mock('./docker-exec.js', () => ({ dockerExec: mockDockerExec }));
vi.mock('./terminal-session.service.js', () => ({ getSessionView: mockGetSessionView }));

const { loadTerminalTestsSpec, runTerminalTests } = await import('./terminal-tests.service.js');
const { contentDir } = await import('./paths.js');

const b64 = (s: string) => Buffer.from(s, 'utf8').toString('base64');

function view(over: Partial<{ containerId: string; history: string[]; cwd: string }> = {}) {
  return {
    containerId: 'container-abc',
    history: [] as string[],
    cwd: '/home/student',
    ...over,
  };
}

beforeEach(() => {
  mockDockerExec.mockReset();
  mockGetSessionView.mockReset();
});

describe('loadTerminalTestsSpec', () => {
  it('loads the English spec for a lesson that has tests', () => {
    const spec = loadTerminalTestsSpec('linux', 'cd');
    expect(spec?.checks).toEqual([{ kind: 'cwd_is', path: 'tools/scripts' }]);
    expect(spec?.requires).toEqual([
      { kind: 'command', name: 'cd' },
      { kind: 'command', name: 'ls' },
    ]);
  });

  it('prefers the ro/ spec when lang is ro and the file exists', () => {
    const spec = loadTerminalTestsSpec('linux', 'cd', 'ro');
    expect(spec?.checks).toEqual([{ kind: 'cwd_is', path: 'unelte/scripturi' }]);
  });

  it('falls back to the English spec when no ro/ file exists', () => {
    expect(loadTerminalTestsSpec('linux', 'pwd', 'ro')).toEqual(
      loadTerminalTestsSpec('linux', 'pwd'),
    );
  });

  it('returns null for a lesson without tests', () => {
    expect(loadTerminalTestsSpec('linux', 'no-such-lesson-xyz')).toBeNull();
  });
});

describe('runTerminalTests', () => {
  it('throws 404 when the lesson has no tests (before session lookup)', async () => {
    await expect(runTerminalTests('user:1', 'sid', 'linux', 'no-such-lesson-xyz')).rejects.toThrow(
      'This lesson has no tests',
    );
    expect(mockGetSessionView).not.toHaveBeenCalled();
  });

  it('throws 404 when the session is missing or not owned', async () => {
    mockGetSessionView.mockReturnValue(null);
    await expect(runTerminalTests('user:1', 'sid', 'linux', 'cd')).rejects.toThrow(
      'Session not found',
    );
  });

  it('evaluates cwd_is server-side without touching the container', async () => {
    mockGetSessionView.mockReturnValue(
      view({ cwd: '/home/student/tools/scripts', history: ['cd tools', 'ls', 'cd scripts'] }),
    );
    const res = await runTerminalTests('user:1', 'sid', 'linux', 'cd');
    expect(res.status).toBe('passed');
    expect(mockDockerExec).not.toHaveBeenCalled();
  });

  it('fails cwd_is when the student is in the wrong directory', async () => {
    mockGetSessionView.mockReturnValue(view({ cwd: '/home/student/tools', history: ['cd tools'] }));
    const res = await runTerminalTests('user:1', 'sid', 'linux', 'cd');
    expect(res.status).toBe('failed');
    expect(res.checks.find((c) => c.messageKey === 'terminalTests.check.cwd_is')?.passed).toBe(
      false,
    );
  });

  it('fails a requires rule (command name) when it is absent from history', async () => {
    mockGetSessionView.mockReturnValue(
      view({ cwd: '/home/student/tools/scripts', history: ['pwd'] }),
    );
    const res = await runTerminalTests('user:1', 'sid', 'linux', 'cd');
    expect(res.status).toBe('failed');
    expect(res.checks.find((c) => c.messageKey === 'terminalTests.require.command')?.passed).toBe(
      false,
    );
  });

  it('passes container state checks when the probe returns P for each', async () => {
    mockGetSessionView.mockReturnValue(
      view({ history: ['touch mission.txt crew.txt', 'mkdir -p reports/logs'] }),
    );
    mockDockerExec.mockResolvedValue('0 P\n1 P\n2 P\n3 P\n');
    const res = await runTerminalTests('user:1', 'sid', 'linux', 'touch');
    expect(res.status).toBe('passed');
    expect(mockDockerExec).toHaveBeenCalledOnce();
  });

  it('fails when a container state check returns F', async () => {
    mockGetSessionView.mockReturnValue(view({ history: ['touch mission.txt'] }));
    mockDockerExec.mockResolvedValue('0 P\n1 F\n2 P\n');
    const res = await runTerminalTests('user:1', 'sid', 'linux', 'touch');
    expect(res.status).toBe('failed');
  });

  it('compares command_output on the server (decoding base64)', async () => {
    const expected =
      'warning: hull temperature rising\nwarning: fuel reserve low\nwarning: comms latency high';
    mockGetSessionView.mockReturnValue(
      view({
        history: [
          'grep warning system.log',
          'grep error system.log',
          'cp system.log scan/shift.log',
        ],
      }),
    );
    mockDockerExec.mockResolvedValue(`0 O ${b64(expected + '\n')}\n1 P\n2 P\n`);
    const res = await runTerminalTests('user:1', 'sid', 'linux', 'grep');
    expect(res.status).toBe('passed');
    expect(
      res.checks.find((c) => c.messageKey === 'terminalTests.check.command_output')?.passed,
    ).toBe(true);
  });

  it('fails command_output when the produced output differs', async () => {
    mockGetSessionView.mockReturnValue(view({ history: ['grep warning system.log'] }));
    mockDockerExec.mockResolvedValue(`0 O ${b64('nothing here')}\n`);
    const res = await runTerminalTests('user:1', 'sid', 'linux', 'grep');
    expect(res.status).toBe('failed');
  });

  it('maps a dockerExec failure to a 500 error', async () => {
    mockGetSessionView.mockReturnValue(view({ history: ['touch mission.txt'] }));
    mockDockerExec.mockRejectedValue(new Error('boom'));
    await expect(runTerminalTests('user:1', 'sid', 'linux', 'touch')).rejects.toThrow(
      'Could not check your work',
    );
  });

  it('covers files_equal + dirs_equal check messages (cp)', async () => {
    mockGetSessionView.mockReturnValue(
      view({
        history: ['mkdir backups', 'cp mission.txt backups/mission.txt', 'cp -r reports backups'],
      }),
    );
    mockDockerExec.mockResolvedValue('0 P\n1 P\n');
    const res = await runTerminalTests('user:1', 'sid', 'linux', 'cp');
    expect(res.status).toBe('passed');
    expect(res.checks.some((c) => c.messageKey === 'terminalTests.check.files_equal')).toBe(true);
    expect(res.checks.some((c) => c.messageKey === 'terminalTests.check.dirs_equal')).toBe(true);
  });

  it('covers the file_mode check message (chmod-numeric)', async () => {
    mockGetSessionView.mockReturnValue(
      view({
        history: [
          'mkdir engine-bay',
          'mv engine_control.sh engine-bay/',
          'chmod 750 engine-bay/engine_control.sh',
        ],
      }),
    );
    mockDockerExec.mockResolvedValue('0 P\n1 P\n2 P\n');
    const res = await runTerminalTests('user:1', 'sid', 'linux', 'chmod-numeric');
    expect(res.status).toBe('passed');
    expect(res.checks.some((c) => c.messageKey === 'terminalTests.check.file_mode')).toBe(true);
  });

  it('covers the file_contains check message (stderr)', async () => {
    mockGetSessionView.mockReturnValue(
      view({
        history: [
          'ls report.txt ghost.txt 2> errors.log',
          'mkdir logs',
          'mv errors.log logs/',
          'grep "No such" logs/errors.log',
        ],
      }),
    );
    mockDockerExec.mockResolvedValue('0 P\n1 P\n');
    const res = await runTerminalTests('user:1', 'sid', 'linux', 'stderr');
    expect(res.status).toBe('passed');
    expect(res.checks.some((c) => c.messageKey === 'terminalTests.check.file_contains')).toBe(true);
  });

  it('covers dir_exists (mkdir) and path_absent (rm) checks', async () => {
    mockGetSessionView.mockReturnValue(
      view({
        history: ['mkdir -p mission/logs/day1 mission/data mission/backups', 'tree mission'],
      }),
    );
    mockDockerExec.mockResolvedValue('0 P\n1 P\n2 P\n');
    expect((await runTerminalTests('user:1', 'sid', 'linux', 'mkdir')).status).toBe('passed');

    mockGetSessionView.mockReturnValue(
      view({
        history: ['cp mission.txt keep/mission.txt', 'rm junk.txt', 'rm temp.log cache.tmp'],
      }),
    );
    mockDockerExec.mockResolvedValue('0 P\n1 P\n2 P\n3 P\n4 P\n');
    expect((await runTerminalTests('user:1', 'sid', 'linux', 'rm')).status).toBe('passed');
  });

  describe('path_exists check + empty rule (via a temporary fixture)', () => {
    const slug = 'zz-extra-fixture';
    const file = path.join(contentDir('linux'), `${slug}-tests.json`);

    beforeEach(() => {
      fs.writeFileSync(
        file,
        JSON.stringify({
          checks: [{ kind: 'path_exists', path: 'somefile' }],
          requires: [{ kind: 'command' }],
        }),
      );
    });
    afterAll(() => {
      if (fs.existsSync(file)) fs.unlinkSync(file);
    });

    it('passes path_exists but fails the empty (no name/pattern) rule', async () => {
      mockGetSessionView.mockReturnValue(view({ history: ['ls'] }));
      mockDockerExec.mockResolvedValue('0 P\n');
      const res = await runTerminalTests('user:1', 'sid', 'linux', slug);
      expect(
        res.checks.find((c) => c.messageKey === 'terminalTests.check.path_exists')?.passed,
      ).toBe(true);
      expect(res.status).toBe('failed');
    });
  });

  describe('forbids (via a temporary fixture)', () => {
    const slug = 'zz-forbids-fixture';
    const file = path.join(contentDir('linux'), `${slug}-tests.json`);

    beforeEach(() => {
      fs.writeFileSync(
        file,
        JSON.stringify({
          requires: [{ kind: 'command', name: 'ls' }],
          forbids: [{ kind: 'command', name: 'rm' }],
        }),
      );
    });
    afterAll(() => {
      if (fs.existsSync(file)) fs.unlinkSync(file);
    });

    it('passes when the forbidden command is absent', async () => {
      mockGetSessionView.mockReturnValue(view({ history: ['ls'] }));
      const res = await runTerminalTests('user:1', 'sid', 'linux', slug);
      expect(res.status).toBe('passed');
    });

    it('fails when the forbidden command was used', async () => {
      mockGetSessionView.mockReturnValue(view({ history: ['ls', 'rm junk.txt'] }));
      const res = await runTerminalTests('user:1', 'sid', 'linux', slug);
      expect(res.status).toBe('failed');
      expect(res.checks.find((c) => c.messageKey === 'terminalTests.forbid.command')?.passed).toBe(
        false,
      );
    });
  });
});
