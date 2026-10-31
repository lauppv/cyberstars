import os from 'os';
import { describe, it, expect } from 'vitest';
import { sandboxSettings } from './sandbox.js';

describe('sandboxSettings', () => {
  it('keeps the defaults the sandbox has always had', () => {
    expect(sandboxSettings({})).toEqual({
      idleMs: 15 * 60 * 1000,
      maxContainers: 50,
      memory: '128m',
      pids: '64',
      cpus: '0.5',
      uid: '10001',
      maxBusy: os.availableParallelism() * 4,
      queueTimeoutMs: 30_000,
      stopAfterMs: 20_000,
    });
  });

  it('reads each one from the environment, under the names it always had', () => {
    expect(
      sandboxSettings({
        CODE_CONTAINER_IDLE_MS: '1000',
        CODE_MAX_CONTAINERS: '2',
        CODE_RUN_MEMORY: '64m',
        CODE_RUN_PIDS: '32',
        CODE_RUN_CPUS: '1',
        SANDBOX_UID: '20002',
        SANDBOX_MAX_BUSY: '3',
        SANDBOX_QUEUE_TIMEOUT_MS: '5000',
        SANDBOX_STOP_AFTER_MS: '6000',
      }),
    ).toEqual({
      idleMs: 1000,
      maxContainers: 2,
      memory: '64m',
      pids: '32',
      cpus: '1',
      uid: '20002',
      maxBusy: 3,
      queueTimeoutMs: 5000,
      stopAfterMs: 6000,
    });
  });

  it('runs as the image user under rootless Podman', () => {
    expect(sandboxSettings({ SANDBOX_RUN_AS_USER: 'false', SANDBOX_UID: '20002' }).uid).toBe(false);
    expect(sandboxSettings({ SANDBOX_RUN_AS_USER: 'true' }).uid).toBe('10001');
  });
});
