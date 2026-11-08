import fs from 'fs';
import path from 'path';
import { describe, it, expect } from 'vitest';
import { agent, createAuthenticatedAgent } from './helpers.js';
import { courseDir } from '@cyberstars/content/paths';

// What a web lesson starts from (CYB-119). The course's first lesson carries
// nothing on, so it starts from its own files for everyone.
describe('GET /api/lessons/:courseKey/:lessonSlug/start', () => {
  const own = fs.readFileSync(path.join(courseDir('web-dev'), 'first-page-code.md'), 'utf8');

  it("gives a guest the course's version", async () => {
    const res = await agent().get('/api/lessons/web-dev/first-page/start').expect(200);
    expect(res.body).toEqual({ course: own, passed: null });
  });

  it('answers a signed-in student too', async () => {
    const { agent: a } = await createAuthenticatedAgent();
    const res = await a.get('/api/lessons/web-dev/first-page/start?lang=ro').expect(200);
    expect(res.body).toEqual({ course: own, passed: null });
  });

  it('refuses a course that is not a web course and a lesson it has not', async () => {
    await agent().get('/api/lessons/python/print/start').expect(400);
    await agent().get('/api/lessons/web-dev/no-such-lesson/start').expect(404);
  });
});
