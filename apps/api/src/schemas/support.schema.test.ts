import { describe, it, expect } from 'vitest';
import { SUPPORT_MESSAGE_MAX_LENGTH } from '@cyberstars/shared/support';
import { addMessageSchema, createTicketSchema } from './support.schema.js';

const ticket = (message: string) => ({ type: 'BUG', subject: 'Run hangs', message });

describe('createTicketSchema', () => {
  it('takes a message up to the limit', () => {
    const message = 'a'.repeat(SUPPORT_MESSAGE_MAX_LENGTH);
    expect(createTicketSchema.parse(ticket(message)).message).toBe(message);
  });

  it('refuses a longer message and says why', () => {
    const result = createTicketSchema.safeParse(ticket('a'.repeat(SUPPORT_MESSAGE_MAX_LENGTH + 1)));
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe('Message is too long (max 5000 chars)');
  });

  it('refuses a subject past its column', () => {
    expect(() => createTicketSchema.parse({ ...ticket('hi'), subject: 'a'.repeat(201) })).toThrow(
      'Subject is too long',
    );
  });
});

describe('addMessageSchema', () => {
  it('holds a reply to the same limit', () => {
    expect(
      addMessageSchema.safeParse({ message: 'a'.repeat(SUPPORT_MESSAGE_MAX_LENGTH) }).success,
    ).toBe(true);
    expect(
      addMessageSchema.safeParse({ message: 'a'.repeat(SUPPORT_MESSAGE_MAX_LENGTH + 1) }).success,
    ).toBe(false);
  });
});
