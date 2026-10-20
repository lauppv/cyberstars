import { describe, it, expect } from 'vitest';
import { inLine, isWaiting, waitKey } from './run-waits.js';

describe('waitKey', () => {
  it("keys a request by its owner and the page's id", () => {
    expect(waitKey('user:1', 'a1-b2')).toBe('user:1|a1-b2');
  });

  it('gives no key without an owner or a usable id', () => {
    expect(waitKey(null, 'a1')).toBeNull();
    expect(waitKey('user:1', undefined)).toBeNull();
    expect(waitKey('user:1', '')).toBeNull();
    expect(waitKey('user:1', 'a|b')).toBeNull();
    expect(waitKey('user:1', 'x'.repeat(65))).toBeNull();
  });
});

describe('inLine', () => {
  it('counts a request as waiting from joining the line until it gets its slot', async () => {
    let grant: (release: () => void) => void = () => {};
    const slot = inLine('user:1|r', (onWait) => {
      onWait();
      return new Promise<() => void>((resolve) => (grant = resolve));
    });
    expect(isWaiting('user:1|r')).toBe(true);
    // Another owner asking with the same id learns nothing
    expect(isWaiting('user:2|r')).toBe(false);

    grant(() => {});
    await slot;
    expect(isWaiting('user:1|r')).toBe(false);
  });

  it('stops counting it when it gives up', async () => {
    const slot = inLine('user:1|gone', (onWait) => {
      onWait();
      return Promise.reject(new Error('busy'));
    });
    await expect(slot).rejects.toThrow('busy');
    expect(isWaiting('user:1|gone')).toBe(false);
  });

  it('never counts a request that got its slot at once, or one with no key', async () => {
    await inLine('user:1|fast', async () => () => {});
    expect(isWaiting('user:1|fast')).toBe(false);

    let waitingMeanwhile = true;
    await inLine(null, async (onWait) => {
      onWait();
      waitingMeanwhile = isWaiting(null);
      return () => {};
    });
    expect(waitingMeanwhile).toBe(false);
  });
});
