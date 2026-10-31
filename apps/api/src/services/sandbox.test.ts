import { describe, it, expect } from 'vitest';
import { onlineGuests, sandbox } from './sandbox.js';

// The guest limit's wiring, editor containers and terminal sessions counted
// together, is driven in terminal-session.caps.test.ts
describe('the code sandbox', () => {
  it('runs Python, Java and C, and nothing by a course name', () => {
    expect(sandbox.runtimeOf('python')?.image).toBe('python:3.10-slim');
    expect(sandbox.runtimeOf('java')?.memory).toBe('256m');
    expect(sandbox.runtimeOf('c')?.image).toBe('gcc:latest');
    expect(sandbox.runtimeOf('algo-java')).toBeNull();
  });
});

describe('onlineGuests', () => {
  it('counts the guests with a tab open, once each, and no signed-in user', () => {
    sandbox.openSession('guest:a');
    sandbox.openSession('guest:a'); // two tabs, one browser
    sandbox.openSession('ip:1.2.3.4');
    sandbox.openSession('user:5');
    expect(onlineGuests()).toBe(2);
    sandbox.closeSession('guest:a');
    sandbox.closeSession('guest:a');
    sandbox.closeSession('ip:1.2.3.4');
    sandbox.closeSession('user:5');
    expect(onlineGuests()).toBe(0);
  });
});
