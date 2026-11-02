import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import { AppError } from '@cyberstars-framework/server-kit/errors';
import { featureRule, type UsageRules } from './rules.js';
import { createFeatureGate, createUsage } from './server.js';

type Role = 'member' | 'staff';

describe('createFeatureGate', () => {
  const preview = { reports: true, search: false };
  const canAccessFeature = featureRule<keyof typeof preview, Role>({
    preview,
    isAdmin: (role) => role === 'staff',
  });
  const role = vi.fn<(req: Request) => Promise<Role | undefined>>();

  function gate(isProd: boolean) {
    return createFeatureGate<keyof typeof preview, Role>({
      canAccess: (feature, callerRole) => canAccessFeature(feature, callerRole, isProd),
      role,
    });
  }

  function call() {
    const req = {} as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    } as unknown as Response;
    const next = vi.fn() as unknown as NextFunction;
    return { req, res, next };
  }

  afterEach(() => vi.clearAllMocks());

  it('lets everyone through to a launched feature, without reading the role', async () => {
    const { req, res, next } = call();
    await gate(true)('search')(req, res, next);
    expect(next).toHaveBeenCalledWith();
    expect(role).not.toHaveBeenCalled();
  });

  it('lets everyone through to a preview feature in development, without reading the role', async () => {
    const { req, res, next } = call();
    await gate(false)('reports')(req, res, next);
    expect(next).toHaveBeenCalledWith();
    expect(role).not.toHaveBeenCalled();
  });

  it('answers 404 to a non-admin on a preview feature in production', async () => {
    role.mockResolvedValueOnce('member');
    const { req, res, next } = call();
    await gate(true)('reports')(req, res, next);
    expect(role).toHaveBeenCalledWith(req);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Not found' });
    expect(next).not.toHaveBeenCalled();
  });

  it('answers 404 to a guest on a preview feature in production', async () => {
    role.mockResolvedValueOnce(undefined);
    const { req, res, next } = call();
    await gate(true)('reports')(req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(next).not.toHaveBeenCalled();
  });

  it('lets an admin through to a preview feature in production', async () => {
    role.mockResolvedValueOnce('staff');
    const { req, res, next } = call();
    await gate(true)('reports')(req, res, next);
    expect(next).toHaveBeenCalledWith();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('hands a failed role lookup to the error handler', async () => {
    const boom = new Error('db down');
    role.mockRejectedValueOnce(boom);
    const { req, res, next } = call();
    await gate(true)('reports')(req, res, next);
    expect(next).toHaveBeenCalledWith(boom);
    expect(res.status).not.toHaveBeenCalled();
  });
});

describe('createUsage', () => {
  const HOUR = 60 * 60 * 1000;
  const rules: UsageRules<'export' | 'invite'> = {
    export: { limit: 3, windowMs: 24 * HOUR },
    invite: { limit: 10, windowMs: 2 * HOUR },
  };
  const store = { list: vi.fn(), take: vi.fn(), giveBack: vi.fn() };
  const usage = createUsage({ rules, store });
  const NOW = new Date('2026-11-02T12:00:00Z');

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
    store.list.mockResolvedValue([]);
  });
  afterEach(() => vi.useRealTimers());

  describe('getSummary', () => {
    it('gives every action of the rules a full allowance and no window', async () => {
      const summary = await usage.getSummary(1, false);
      expect(summary).toEqual({
        export: { used: 0, limit: 3, remaining: 3, resetAt: null, unlimited: false },
        invite: { used: 0, limit: 10, remaining: 10, resetAt: null, unlimited: false },
      });
    });

    it("reads each action's live window, refilling at its own time", async () => {
      const windowStart = new Date(NOW.getTime() - 60_000);
      store.list.mockResolvedValue([
        { action: 'export', windowStart, used: 2 },
        { action: 'invite', windowStart, used: 4 },
      ]);

      const summary = await usage.getSummary(1, false);

      expect(store.list).toHaveBeenCalledWith(1);
      expect(summary.export).toMatchObject({
        used: 2,
        remaining: 1,
        resetAt: new Date(windowStart.getTime() + 24 * HOUR).toISOString(),
      });
      expect(summary.invite).toMatchObject({
        used: 4,
        remaining: 6,
        resetAt: new Date(windowStart.getTime() + 2 * HOUR).toISOString(),
      });
    });

    it('counts an ended window as unused', async () => {
      const windowStart = new Date(NOW.getTime() - 2 * HOUR);
      store.list.mockResolvedValue([{ action: 'invite', windowStart, used: 10 }]);

      const summary = await usage.getSummary(1, false);

      expect(summary.invite).toMatchObject({ used: 0, remaining: 10, resetAt: null });
    });

    it('never goes below nothing left', async () => {
      store.list.mockResolvedValue([{ action: 'export', windowStart: NOW, used: 5 }]);
      expect((await usage.getSummary(1, false)).export.remaining).toBe(0);
    });

    it('is unlimited for an admin, without reading the table', async () => {
      const summary = await usage.getSummary(9, true);
      expect(summary.export).toEqual({
        used: 0,
        limit: 3,
        remaining: Infinity,
        resetAt: null,
        unlimited: true,
      });
      expect(store.list).not.toHaveBeenCalled();
    });
  });

  describe('hold', () => {
    it("takes one unit under the action's own limit and window, and remembers the window", async () => {
      store.take.mockResolvedValue({ windowStart: NOW, taken: 1 });

      const held = await usage.hold(2, 'invite', false);

      expect(store.take).toHaveBeenCalledWith(2, 'invite', 1, 10, 2 * HOUR, NOW);
      expect(held).toEqual({ userId: 2, action: 'invite', windowStart: NOW, units: 1 });
    });

    it('keeps however many were left when fewer than asked', async () => {
      store.take.mockResolvedValue({ windowStart: NOW, taken: 1 });

      const held = await usage.hold(2, 'invite', false, 2);

      expect(store.take).toHaveBeenCalledWith(2, 'invite', 2, 10, 2 * HOUR, NOW);
      expect(held?.units).toBe(1);
    });

    it('throws 429 with the refill time when none are left', async () => {
      const windowStart = new Date(NOW.getTime() - 60_000);
      store.take.mockResolvedValue({ windowStart, taken: 0 });

      const err = await usage.hold(2, 'export', false).catch((e: unknown) => e);

      expect(err).toBeInstanceOf(AppError);
      expect((err as AppError).statusCode).toBe(429);
      expect((err as AppError).message).toBe(
        `Limit reached. It refills at ${new Date(windowStart.getTime() + 24 * HOUR).toISOString()}`,
      );
    });

    it('holds nothing for an admin', async () => {
      expect(await usage.hold(9, 'export', true)).toBeNull();
      expect(store.take).not.toHaveBeenCalled();
    });
  });

  describe('release', () => {
    const held = { userId: 2, action: 'invite' as const, windowStart: NOW, units: 2 };

    it('gives units back to the window they came from', async () => {
      await usage.release(held, 1);
      expect(store.giveBack).toHaveBeenCalledWith(2, 'invite', NOW, 1);
    });

    it('never gives back more than was held', async () => {
      await usage.release(held, 5);
      expect(store.giveBack).toHaveBeenCalledWith(2, 'invite', NOW, 2);
    });

    it('does nothing for nothing, or for an admin', async () => {
      await usage.release(held, 0);
      await usage.release(null, 2);
      expect(store.giveBack).not.toHaveBeenCalled();
    });
  });

  describe('consume', () => {
    it('spends one unit and returns the refreshed summary', async () => {
      store.take.mockResolvedValue({ windowStart: NOW, taken: 1 });
      store.list.mockResolvedValue([{ action: 'export', windowStart: NOW, used: 1 }]);

      const summary = await usage.consume(3, 'export', false);

      expect(store.take).toHaveBeenCalledWith(3, 'export', 1, 3, 24 * HOUR, NOW);
      expect(summary.export.used).toBe(1);
    });

    it("spends nothing for an admin and answers an admin's summary", async () => {
      const summary = await usage.consume(9, 'export', true);
      expect(store.take).not.toHaveBeenCalled();
      expect(summary.export.unlimited).toBe(true);
    });
  });
});
