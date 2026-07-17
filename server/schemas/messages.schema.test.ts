import { describe, it, expect } from 'vitest';
import {
  openConversationSchema,
  sendMessageSchema,
  markReadSchema,
  historyQuerySchema,
} from './messages.schema.js';

describe('openConversationSchema', () => {
  it('accepts a positive recipient id', () => {
    expect(openConversationSchema.parse({ recipientId: 3 })).toEqual({ recipientId: 3 });
  });
  it('rejects a non-positive id', () => {
    expect(() => openConversationSchema.parse({ recipientId: 0 })).toThrow();
  });
});

describe('sendMessageSchema', () => {
  it('trims and accepts content', () => {
    expect(sendMessageSchema.parse({ content: '  hi  ' })).toEqual({ content: 'hi' });
  });
  it('rejects empty content', () => {
    expect(() => sendMessageSchema.parse({ content: '   ' })).toThrow();
  });
  it('rejects content over 2000 chars', () => {
    expect(() => sendMessageSchema.parse({ content: 'x'.repeat(2001) })).toThrow();
  });
});

describe('markReadSchema', () => {
  it('accepts a positive id', () => {
    expect(markReadSchema.parse({ upToMessageId: 5 })).toEqual({ upToMessageId: 5 });
  });
});

describe('historyQuerySchema', () => {
  it('defaults take to 30 and before to undefined', () => {
    expect(historyQuerySchema.parse({})).toEqual({ take: 30, before: undefined });
  });
  it('clamps take to [1,50]', () => {
    expect(historyQuerySchema.parse({ take: '999' }).take).toBe(50);
    expect(historyQuerySchema.parse({ take: '0' }).take).toBe(1);
  });
  it('falls back to 30 on garbage take', () => {
    expect(historyQuerySchema.parse({ take: 'abc' }).take).toBe(30);
  });
  it('passes a valid before cursor and drops an invalid one', () => {
    expect(historyQuerySchema.parse({ before: '100' }).before).toBe(100);
    expect(historyQuerySchema.parse({ before: '-5' }).before).toBeUndefined();
  });
});
