import { describe, it, expect } from 'vitest';
import { agent, createAuthenticatedAgent, userIdFor } from './helpers.js';
import { prisma } from '../../server/config/db.js';
import { record } from '../../server/services/submissions.service.js';
import type { RunTestsResponse } from '../../shared/tests.js';

// The judge needs Docker, so attempts are stored through the same service the
// Run Tests controller calls, then read back over the API.
function verdict(passedCount: number, overrides: Partial<RunTestsResponse> = {}): RunTestsResponse {
  const total = 3;
  const passed = passedCount === total;
  return {
    status: passed ? 'passed' : 'failed',
    structureFailures: [],
    cases: [
      ...Array.from({ length: passedCount }, (_, index) => ({
        index,
        visible: true,
        passed: true,
      })),
      ...(passed
        ? []
        : [{ index: passedCount, visible: true, passed: false, expected: 'b', actual: 'a' }]),
    ],
    total,
    passedCount,
    runtimeMs: 1.25,
    referenceMs: 0.75,
    ...overrides,
  };
}

describe('Submission history', () => {
  it("lists a lesson's attempts newest first, with their summaries", async () => {
    const { agent: a, email } = await createAuthenticatedAgent();
    const userId = await userIdFor(email);

    const first = await record(userId, 'python', 'print', 'en', 'print("a")', verdict(1));
    const second = await record(userId, 'python', 'print', 'ro', 'print("b")', verdict(3));
    await record(userId, 'python', 'variables', 'en', 'x = 1', verdict(0));

    const res = await a.get('/api/tests/python/print/submissions').expect(200);
    expect(res.body.map((s: { id: number }) => s.id)).toEqual([second.id, first.id]);
    expect(res.body[0]).toEqual({
      id: second.id,
      status: 'passed',
      passedCount: 3,
      total: 3,
      runtimeMs: 1.25,
      referenceMs: 0.75,
      lang: 'ro',
      createdAt: second.createdAt,
    });
    expect(res.body[0]).not.toHaveProperty('code');
  });

  it('keeps only the newest 20 attempts per lesson', async () => {
    const { agent: a, email } = await createAuthenticatedAgent();
    const userId = await userIdFor(email);

    const ids: number[] = [];
    for (let i = 0; i < 22; i++) {
      ids.push((await record(userId, 'python', 'print', 'en', `print(${i})`, verdict(1))).id);
    }
    // Another lesson's history is untouched by this lesson's cap.
    await record(userId, 'python', 'variables', 'en', 'x = 1', verdict(0));

    const res = await a.get('/api/tests/python/print/submissions').expect(200);
    expect(res.body.map((s: { id: number }) => s.id)).toEqual(ids.slice(2).reverse());
    expect(await prisma.lessonSubmission.count({ where: { userId } })).toBe(21);
  });

  it('opens an attempt with its code and the case it stopped on', async () => {
    const { agent: a, email } = await createAuthenticatedAgent();
    const userId = await userIdFor(email);
    const saved = await record(
      userId,
      'python',
      'print',
      'en',
      'print("a")',
      verdict(1, { runtimeMs: undefined, referenceMs: undefined }),
    );

    const res = await a.get(`/api/tests/submissions/${saved.id}`).expect(200);
    expect(res.body).toEqual({
      ...saved,
      runtimeMs: null,
      referenceMs: null,
      code: 'print("a")',
      syntaxError: null,
      structureFailures: [],
      failedCase: { index: 1, visible: true, passed: false, expected: 'b', actual: 'a' },
    });
  });

  it('stores a syntax error with no failed case', async () => {
    const { agent: a, email } = await createAuthenticatedAgent();
    const saved = await record(
      await userIdFor(email),
      'python',
      'print',
      'en',
      'print(',
      verdict(0, { syntaxError: 'line 1', cases: [] }),
    );

    const res = await a.get(`/api/tests/submissions/${saved.id}`).expect(200);
    expect(res.body.syntaxError).toBe('line 1');
    expect(res.body.failedCase).toBeNull();
  });

  it("hides another student's attempt behind a 404", async () => {
    const { email } = await createAuthenticatedAgent();
    const { agent: other } = await createAuthenticatedAgent();
    const saved = await record(await userIdFor(email), 'python', 'print', 'en', 'x', verdict(1));

    await other.get(`/api/tests/submissions/${saved.id}`).expect(404);
    await other.get(`/api/tests/submissions/${saved.id + 1000}`).expect(404);
    const list = await other.get('/api/tests/python/print/submissions').expect(200);
    expect(list.body).toEqual([]);
  });

  it('rejects an unknown course and an invalid id', async () => {
    const { agent: a } = await createAuthenticatedAgent();

    await a.get('/api/tests/nope/print/submissions').expect(400);
    await a.get('/api/tests/submissions/abc').expect(400);
  });

  it('requires a login', async () => {
    await agent().get('/api/tests/python/print/submissions').expect(401);
    await agent().get('/api/tests/submissions/1').expect(401);
  });

  it('goes away with the account', async () => {
    const { email } = await createAuthenticatedAgent();
    const userId = await userIdFor(email);
    await record(userId, 'python', 'print', 'en', 'x', verdict(1));

    await prisma.user.delete({ where: { id: userId } });

    expect(await prisma.lessonSubmission.count({ where: { userId } })).toBe(0);
  });
});
