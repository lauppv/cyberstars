import { describe, it, expect } from 'vitest';
import express from 'express';
import request from 'supertest';
import { securityHeaders } from './securityHeaders.js';

const app = express();
app.use(securityHeaders);
app.use((_req, res) => {
  res.send('ok');
});

const policyOf = async (path: string) =>
  (await request(app).get(path)).headers['content-security-policy'] as string;

describe('securityHeaders', () => {
  it("gives a web lesson's preview a policy of its own, sandboxed", async () => {
    const preview = await policyOf('/web-preview.html');
    expect(preview).toContain("default-src 'none'");
    expect(preview).toContain("script-src 'unsafe-inline' 'unsafe-eval' blob: data: https:;");
    expect(preview).toContain('connect-src https:;');
    expect(preview).toContain("form-action 'none'");
    expect(preview).toContain("frame-ancestors 'self'");
    expect(preview).toContain('sandbox allow-scripts allow-forms allow-modals');
    expect(preview).not.toContain('allow-same-origin');
  });

  it('keeps the strict policy everywhere else', async () => {
    for (const path of [
      '/',
      '/web-preview',
      '/web-preview.html.br',
      '/lesson/web-dev/first-page',
    ]) {
      const policy = await policyOf(path);
      expect(policy, path).toContain("script-src 'self' https://unpkg.com");
      expect(policy, path).not.toContain('sandbox');
    }
  });
});
