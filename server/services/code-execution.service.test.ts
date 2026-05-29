import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockReadFile = vi.fn();
const mockWriteFile = vi.fn();
const mockMkdir = vi.fn();
const mockRm = vi.fn();

function invokeCb(args: unknown[]) {
  const cb = args.find((a) => typeof a === 'function') as ((e?: unknown) => void) | undefined;
  cb?.();
}

const { mockExecFile } = vi.hoisted(() => ({
  mockExecFile: vi.fn((...args: unknown[]) => {
    const cb = args.find((a) => typeof a === 'function') as ((e?: unknown) => void) | undefined;
    cb?.();
  }),
}));

vi.mock('child_process', async (importOriginal) => {
  const actual = await importOriginal<typeof import('child_process')>();
  return { ...actual, execFile: mockExecFile };
});

vi.mock('fs/promises', () => {
  const mod = {
    readFile: (...args: unknown[]) => mockReadFile(...args),
    writeFile: (...args: unknown[]) => mockWriteFile(...args),
    mkdir: (...args: unknown[]) => mockMkdir(...args),
    rm: (...args: unknown[]) => mockRm(...args),
  };
  return { ...mod, default: mod };
});

const { execute } = await import('./code-execution.service.js');

beforeEach(() => {
  vi.clearAllMocks();
  mockExecFile.mockImplementation((...args: unknown[]) => invokeCb(args));
});

describe('execute', () => {
  it("returns 'Language not supported.' for unknown language", async () => {
    const result = await execute('code', 'brainfuck');
    expect(result).toBe('Language not supported.');
  });

  it('returns output for a supported language (mocked docker)', { timeout: 20_000 }, async () => {
    mockWriteFile.mockResolvedValue(undefined);
    mockReadFile.mockResolvedValue('Hello World');
    mockMkdir.mockResolvedValue(undefined);
    mockRm.mockResolvedValue(undefined);

    const result = await execute('print("Hello World")', 'python');
    expect(result).toBe('Hello World');
  });

  it("returns 'No output.' when docker produces empty output", { timeout: 20_000 }, async () => {
    mockWriteFile.mockResolvedValue(undefined);
    mockReadFile.mockResolvedValue('   ');
    mockMkdir.mockResolvedValue(undefined);
    mockRm.mockResolvedValue(undefined);

    const result = await execute('', 'python');
    expect(result).toBe('No output.');
  });

  it("returns 'Error reading output file.' when fs write fails", async () => {
    mockMkdir.mockResolvedValue(undefined);
    mockWriteFile.mockRejectedValue(new Error('disk full'));
    mockRm.mockResolvedValue(undefined);

    const result = await execute('code', 'python');
    expect(result).toBe('Error reading output file.');
  });

  it('kills the container when the run times out', { timeout: 20_000 }, async () => {
    mockMkdir.mockResolvedValue(undefined);
    mockWriteFile.mockResolvedValue(undefined);
    mockReadFile.mockResolvedValue('partial');
    mockRm.mockResolvedValue(undefined);
    mockExecFile.mockImplementationOnce(
      (_cmd: string, _args: string[], _opts: unknown, cb: (e?: unknown) => void) =>
        cb({ killed: true }),
    );

    await execute('while True: pass', 'python');

    const killCall = mockExecFile.mock.calls.find(
      (c) => Array.isArray(c[1]) && (c[1] as string[])[0] === 'kill',
    );
    expect(killCall).toBeTruthy();
    expect(killCall![1]).toEqual(['kill', expect.stringMatching(/^run-/)]);
  });
});
