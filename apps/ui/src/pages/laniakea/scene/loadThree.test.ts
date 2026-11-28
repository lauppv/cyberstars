import { describe, expect, it } from 'vitest';
import { loadThree } from './loadThree';

describe('loadThree', () => {
  it('gives three.js from the site, loaded once', async () => {
    const first = loadThree();
    expect(loadThree()).toBe(first);
    const THREE = await first;
    expect(typeof THREE.Scene).toBe('function');
    expect(typeof THREE.WebGLRenderer).toBe('function');
  });
});
