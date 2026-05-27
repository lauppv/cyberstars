import { execFile } from 'child_process';
import path from 'path';
import os from 'os';
import crypto from 'crypto';
import fs from 'fs/promises';
import { getRuntime } from '../runtimes/registry.js';
import type { LanguageRuntime } from '../runtimes/types.js';

const PISTON_URL = 'https://emkc.org/api/v2/piston/execute';

// Limite per-execuție. Dacă vreun runner cade pe sistem fără cgroup-memory,
// suprascrie din env (ex. CODE_RUN_MEMORY=) ca string gol
const RUN_MEMORY = process.env.CODE_RUN_MEMORY ?? '128m';
const RUN_PIDS = process.env.CODE_RUN_PIDS ?? '64';
const RUN_DIR = process.env.CODE_RUN_DIR ?? path.join(os.tmpdir(), 'cyberstars-runs');

interface PistonResponse {
  run?: { output?: string };
}

export async function execute(code: string, language: string, stdin = ''): Promise<string> {
  const runtime = getRuntime(language);
  if (!runtime) return 'Language not supported.';

  return executeDocker(runtime, code, stdin);
}

async function _executePiston(
  runtime: LanguageRuntime,
  code: string,
  stdin: string,
): Promise<string> {
  try {
    const response = await fetch(PISTON_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: runtime.name,
        version: runtime.pistonVersion,
        files: [{ name: 'main', content: code }],
        stdin,
        args: [],
        compile_timeout: 10000,
        run_timeout: 5000,
        compile_memory_limit: -1,
        run_memory_limit: -1,
      }),
    });

    const data = (await response.json()) as PistonResponse;
    return (data.run?.output || '').trim() || 'No output.';
  } catch {
    return 'Error connecting to execution server.';
  }
}

async function executeDocker(
  runtime: LanguageRuntime,
  code: string,
  stdin: string,
): Promise<string> {
  const runId = crypto.randomUUID();
  const hostDir = path.join(RUN_DIR, runId);
  await fs.mkdir(hostDir, { recursive: true });

  const outputPath = path.join(hostDir, 'output.txt');

  try {
    await Promise.all([
      fs.writeFile(path.join(hostDir, runtime.sourceFile), code, 'utf-8'),
      fs.writeFile(path.join(hostDir, 'stdin.txt'), stdin, 'utf-8'),
      fs.writeFile(outputPath, '', 'utf-8'),
    ]);

    const dockerArgs = [
      'run',
      '--rm',
      '--network=none',
      `--memory=${RUN_MEMORY}`,
      `--pids-limit=${RUN_PIDS}`,
      '-v',
      `${hostDir}:/work`,
      '-w',
      '/work',
      runtime.image,
      'sh',
      '-c',
      runtime.innerCmd,
    ];

    await runDocker(dockerArgs);

    const output = await fs.readFile(outputPath, 'utf-8');
    return output.trim() || 'No output.';
  } catch {
    return 'Error reading output file.';
  } finally {
    fs.rm(hostDir, { recursive: true, force: true }).catch(() => {});
  }
}

function runDocker(args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    execFile('docker', args, { maxBuffer: 1024 * 1024, timeout: 15_000 }, (err) => {
      if (err && (err as NodeJS.ErrnoException).code === 'ENOENT') {
        reject(new Error('Docker is not available'));
      } else {
        resolve();
      }
    });
  });
}
