import { test as base, expect, Page } from '@playwright/test';

/**
 * Playwright test fixtures and utilities for contest arena testing
 */

export type TestFixtures = {
  authenticatedPage: Page;
};

/**
 * Create authenticated page with mocked API responses
 */
export const test = base.extend<TestFixtures>({
  authenticatedPage: async ({ browser }, use) => {
    const page = await browser.newPage();

    // Set auth token
    await page.context().addInitScript(() => {
      localStorage.setItem('auth_token', 'test-token-123');
      localStorage.setItem('user_id', 'user-1');
    });

    await use(page);
    await page.close();
  },
});

export { expect };
