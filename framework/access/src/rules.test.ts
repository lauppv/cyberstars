import { describe, it, expect } from 'vitest';
import { featureRule } from './rules.js';

type Role = 'member' | 'staff';

function sample() {
  const preview = { reports: true, search: false };
  const canAccessFeature = featureRule<keyof typeof preview, Role>({
    preview,
    isAdmin: (role) => role === 'staff',
  });
  return { preview, canAccessFeature };
}

describe('featureRule', () => {
  it('opens a launched feature to everyone, even in production', () => {
    const { canAccessFeature } = sample();
    expect(canAccessFeature('search', undefined, true)).toBe(true);
    expect(canAccessFeature('search', 'member', true)).toBe(true);
  });

  it('opens a preview feature to everyone in development', () => {
    const { canAccessFeature } = sample();
    expect(canAccessFeature('reports', undefined, false)).toBe(true);
    expect(canAccessFeature('reports', 'member', false)).toBe(true);
  });

  it("keeps a preview feature to the app's admins in production", () => {
    const { canAccessFeature } = sample();
    expect(canAccessFeature('reports', 'staff', true)).toBe(true);
    expect(canAccessFeature('reports', 'member', true)).toBe(false);
    expect(canAccessFeature('reports', undefined, true)).toBe(false);
  });

  it('reads the flags on every call', () => {
    const { preview, canAccessFeature } = sample();
    preview.reports = false;
    expect(canAccessFeature('reports', undefined, true)).toBe(true);
  });
});
