import { describe, it, expect, beforeEach, vi } from 'vitest';
import { isCounted, markAdminBrowser, setCounted } from './visitCounting';

beforeEach(() => localStorage.clear());

describe('visitCounting', () => {
  it('counts a browser no admin has signed in on', () => {
    expect(isCounted()).toBe(true);
  });

  it('stops counting once an admin has signed in', () => {
    markAdminBrowser();
    expect(isCounted()).toBe(false);
  });

  it("keeps the admin page's choice to count it again", () => {
    markAdminBrowser();
    setCounted(true);
    markAdminBrowser(); // the next sign-in
    expect(isCounted()).toBe(true);
    setCounted(false);
    expect(isCounted()).toBe(false);
  });

  it('counts the browser when storage is blocked', () => {
    const get = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    const set = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    markAdminBrowser();
    expect(isCounted()).toBe(true);
    get.mockRestore();
    set.mockRestore();
  });
});
