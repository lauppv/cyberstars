import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockReadFile = vi.fn();
const mockWriteFile = vi.fn();
const mockMkdir = vi.fn();
const mockRm = vi.fn();

const { mockExecFile } = vi.hoisted(() => ({
  mockExecFile: vi.fn((_cmd: string, _args: string[], _opts: unknown, cb: () => void) => cb()),
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
  mockExecFile.mockImplementation((_cmd: string, _args: string[], _opts: unknown, cb: () => void) =>
    cb(),
  );
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
});
