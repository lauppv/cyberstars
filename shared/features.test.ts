import { describe, it, expect } from 'vitest';
import { canAccessFeature, PREVIEW_FEATURES } from './features.js';

describe('canAccessFeature', () => {
  it('is open to everyone on dev regardless of role', () => {
    expect(canAccessFeature('leaderboard', undefined, false)).toBe(true);
    expect(canAccessFeature('leaderboard', 'USER', false)).toBe(true);
  });

  it('on prod, a preview feature is admin-only', () => {
    expect(canAccessFeature('leaderboard', 'ADMIN', true)).toBe(true);
    expect(canAccessFeature('leaderboard', 'USER', true)).toBe(false);
    expect(canAccessFeature('leaderboard', 'MODERATOR', true)).toBe(false);
    expect(canAccessFeature('leaderboard', undefined, true)).toBe(false);
  });

  it('a fully-launched feature (not in preview) is open to everyone even on prod', () => {
    const original = PREVIEW_FEATURES.leaderboard;
    PREVIEW_FEATURES.leaderboard = false;
    try {
      expect(canAccessFeature('leaderboard', undefined, true)).toBe(true);
    } finally {
      PREVIEW_FEATURES.leaderboard = original;
    }
  });
});
