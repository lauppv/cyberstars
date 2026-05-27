import { test as base, type Page } from '@playwright/test';
import { resetDB } from '../helpers/db.js';
import { signupViaAPI, resetCounter } from '../helpers/auth.js';

type Fixtures = {
  authedPage: Page;
  userName: string;
};

export const test = base.extend<Fixtures>({
  authedPage: async ({ page, context }, use) => {
    await resetDB();
    resetCounter();
    const { name } = await signupViaAPI(context.request);
    (page as Page & { _e2eUserName?: string })._e2eUserName = name;
    await use(page);
  },
  userName: async ({ authedPage }, use) => {
    const name = (authedPage as Page & { _e2eUserName?: string })._e2eUserName ?? '';
    await use(name);
  },
});

export { expect } from '@playwright/test';
