import { describe, it, expect } from 'vitest';
import express from 'express';
import request from 'supertest';
import { CODE_MAX_LENGTH, WEB_MAX_LENGTH } from '@cyberstars/shared/webFiles';
import { codeFitsCourse } from './codeLength.js';

const app = express();
app.use(express.json({ limit: '1mb' }));
app.put('/:courseKey/:lessonSlug/code', codeFitsCourse, (_req, res) => {
  res.json({ ok: true });
});

const send = (course: string, length: number) =>
  request(app)
    .put(`/${course}/x/code`)
    .send({ code: 'x'.repeat(length) });

describe('codeFitsCourse', () => {
  it("holds a lesson's code to its course: a web site has more room", async () => {
    expect((await send('python', CODE_MAX_LENGTH)).status).toBe(200);
    expect((await send('python', CODE_MAX_LENGTH + 1)).status).toBe(400);
    expect((await send('web-dev', CODE_MAX_LENGTH + 1)).status).toBe(200);
    expect((await send('web-dev', WEB_MAX_LENGTH)).status).toBe(200);
    const big = await send('web-dev', WEB_MAX_LENGTH + 1);
    expect(big.status).toBe(400);
    expect(big.body.error).toBe('The code is too long for its lesson');
  });
});
