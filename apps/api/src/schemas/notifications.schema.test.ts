import { describe, it, expect } from 'vitest';
import { markSectionReadSchema } from './notifications.schema.js';

describe('markSectionReadSchema', () => {
  it('takes a section, with or without the thread or ticket', () => {
    expect(markSectionReadSchema.parse({ section: 'forum', entityId: 7 })).toEqual({
      section: 'forum',
      entityId: 7,
    });
    expect(markSectionReadSchema.parse({ section: 'connections' })).toEqual({
      section: 'connections',
    });
  });

  it.each([
    ['the bell, which has its own read', { section: 'bell' }],
    ['no section', { entityId: 7 }],
    ['an id that is not a positive whole number', { section: 'support', entityId: 0 }],
    ['an id sent as text', { section: 'support', entityId: '3' }],
  ])('refuses %s', (_, body) => {
    expect(markSectionReadSchema.safeParse(body).success).toBe(false);
  });
});
