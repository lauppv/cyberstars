import { describe, it, expect } from 'vitest';
import { canAccessFeature, PREVIEW_FEATURES, type FeatureKey } from './features.js';

// These assertions describe the gate's behavior for a preview vs. a launched
// feature. They force the sample flag to the state under test (in try/finally)
// so they stay correct no matter which features are actually launched.
const SAMPLE: FeatureKey = 'messaging';

function withFlag<T>(value: boolean, fn: () => T): T {
  const original = PREVIEW_FEATURES[SAMPLE];
  PREVIEW_FEATURES[SAMPLE] = value;
  try {
    return fn();
  } finally {
    PREVIEW_FEATURES[SAMPLE] = original;
  }
}

describe('canAccessFeature', () => {
  it('is open to everyone on dev regardless of role', () => {
    // dev short-circuits before the flag is even read
    expect(canAccessFeature(SAMPLE, undefined, false)).toBe(true);
    expect(canAccessFeature(SAMPLE, 'USER', false)).toBe(true);
  });

  it('on prod, a preview feature is admin-only (founder included)', () => {
    withFlag(true, () => {
      expect(canAccessFeature(SAMPLE, 'ADMIN', true)).toBe(true);
      expect(canAccessFeature(SAMPLE, 'FOUNDER', true)).toBe(true);
      expect(canAccessFeature(SAMPLE, 'USER', true)).toBe(false);
      expect(canAccessFeature(SAMPLE, 'MODERATOR', true)).toBe(false);
      expect(canAccessFeature(SAMPLE, undefined, true)).toBe(false);
    });
  });

  it('a fully-launched feature (not in preview) is open to everyone even on prod', () => {
    withFlag(false, () => {
      expect(canAccessFeature(SAMPLE, undefined, true)).toBe(true);
    });
  });
});
