import { test, expect, Page } from '@playwright/test';

/**
 * TDD RED Phase - Real-time Submission Verdict Sync
 * Tests for cross-view verdict updates and state synchronization
 */

test.describe('Real-time Submission Verdict Sync (RED Phase)', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();

    // Mock localStorage
    await page.context().addInitScript(() => {
      localStorage.setItem('auth_token', 'test-token-123');
      localStorage.setItem('user_id', 'user-1');
    });
  });

  test.afterEach(async () => {
    await page.close();
  });

  test.describe('Verdict Update Broadcasting', () => {
    /**
     * TEST 1: Submission verdict broadcasts to all connected clients
     */
    test('should broadcast verdict to all connected participants', async () => {
      // Setup first client (user-1)
      const page1 = page;

      // Setup second client (user-2)
      const page2 = await page.context().newPage();
      await page2.context().addInitScript(() => {
        localStorage.setItem('auth_token', 'test-token-456');
        localStorage.setItem('user_id', 'user-2');
      });

      // Both load the contest arena
      await page1.goto('/contests/1/arena');
      await page2.goto('/contests/1/arena');

      let verdictReceived1 = false;
      let verdictReceived2 = false;

      // Listen for WebSocket updates on page1
      page1.on('console', (msg) => {
        if (msg.text().includes('verdict-update')) {
          verdictReceived1 = true;
        }
      });

      // Listen for WebSocket updates on page2
      page2.on('console', (msg) => {
        if (msg.text().includes('verdict-update')) {
          verdictReceived2 = true;
        }
      });

      // User-1 submits code
      await page1.route('**/api/contests/1/submit', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            success: true,
            data: { submissionId: 'sub-1', status: 'PENDING' },
          }),
        });
      });

      const editor = page1.locator('.monaco-editor');
      await editor.click();
      await page1.keyboard.type('code');

      const submitButton = page1.locator('[data-testid="submit-button"]');
      await submitButton.click();

      // Simulate WebSocket broadcast of verdict
      await page1.evaluate(() => {
        window.dispatchEvent(new CustomEvent('verdict-update', { detail: { submissionId: 'sub-1', status: 'ACCEPTED' } }));
      });

      await page2.evaluate(() => {
        window.dispatchEvent(new CustomEvent('verdict-update', { detail: { submissionId: 'sub-1', status: 'ACCEPTED' } }));
      });

      await page.waitForTimeout(500);

      // Both should reflect the verdict
      await expect(page1.locator('[data-testid="status-badge"]:has-text("ACCEPTED")')).toBeVisible({ timeout: 5000 });
      await expect(page2.locator('[data-testid="status-badge"]:has-text("ACCEPTED")')).toBeVisible({ timeout: 5000 });

      await page2.close();
    });

    /**
     * TEST 2: Verdict updates show in submission history across views
     */
    test('should update submission history when verdict arrives', async () => {
      await page.goto('/contests/1/arena');

      // Setup mock for submission
      await page.route('**/api/contests/1/submit', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            success: true,
            data: { submissionId: 'sub-1', status: 'PENDING' },
          }),
        });
      });

      // Submit code
      const editor = page.locator('.monaco-editor');
      await editor.click();
      await page.keyboard.type('print(42)');

      const submitButton = page.locator('[data-testid="submit-button"]');
      await submitButton.click();

      // Verify PENDING in history
      await page.waitForTimeout(300);
      let historyRow = page.locator('[data-testid="submission-row"]:has-text("PENDING")');
      await expect(historyRow).toBeVisible({ timeout: 5000 });

      // Simulate verdict WebSocket update
      await page.evaluate(() => {
        window.dispatchEvent(new CustomEvent('verdict-update', {
          detail: {
            submissionId: 'sub-1',
            status: 'ACCEPTED',
            testResults: { totalTests: 5, passedTests: 5 },
          },
        }));
      });

      // Verify history updates to ACCEPTED
      historyRow = page.locator('[data-testid="submission-row"]:has-text("ACCEPTED")');
      await expect(historyRow).toBeVisible({ timeout: 5000 });
    });

    /**
     * TEST 3: Leaderboard updates when verdict arrives
     */
    test('should update leaderboard when submission verdict received', async () => {
      await page.goto('/contests/1/arena');

      // Initial leaderboard state
      let leaderboardRow = page.locator('[data-testid="leaderboard-row"]:has-text("testuser")');
      let initialScore = '0';

      if (await leaderboardRow.isVisible({ timeout: 3000 }).catch(() => false)) {
        initialScore = await leaderboardRow.locator('[data-testid="leaderboard-score"]').textContent() || '0';
      }

      // User submits and gets ACCEPTED verdict
      await page.route('**/api/contests/1/submit', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            success: true,
            data: { submissionId: 'sub-1', status: 'PENDING' },
          }),
        });
      });

      const editor = page.locator('.monaco-editor');
      await editor.click();
      await page.keyboard.type('solution');

      const submitButton = page.locator('[data-testid="submit-button"]');
      await submitButton.click();

      // Simulate verdict and leaderboard update
      await page.evaluate(() => {
        window.dispatchEvent(new CustomEvent('verdict-update', {
          detail: {
            submissionId: 'sub-1',
            status: 'ACCEPTED',
            score: 100,
          },
        }));

        window.dispatchEvent(new CustomEvent('leaderboard-update', {
          detail: {
            participants: [
              { rank: 1, username: 'testuser', score: 100, solved: 1 },
            ],
          },
        }));
      });

      // Verify leaderboard shows updated score
      await page.waitForTimeout(500);
      leaderboardRow = page.locator('[data-testid="leaderboard-row"]:has-text("testuser")');
      const updatedScore = await leaderboardRow.locator('[data-testid="leaderboard-score"]').textContent() || '0';

      expect(parseInt(updatedScore)).toBeGreaterThan(parseInt(initialScore));
    });

    /**
     * TEST 4: Wrong answer verdict reflects in real-time
     */
    test('should show wrong answer verdict immediately', async () => {
      await page.goto('/contests/1/arena');

      await page.route('**/api/submissions/run', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            success: true,
            data: {
              id: 'sub-1',
              status: 'PENDING',
            },
          }),
        });
      });

      const editor = page.locator('.monaco-editor');
      await editor.click();
      await page.keyboard.type('wrong_code');

      const runButton = page.locator('[data-testid="run-button"]');
      await runButton.click();

      // Initially PENDING
      let badge = page.locator('[data-testid="status-badge"]');
      await expect(badge).toContainText('PENDING', { timeout: 5000 });

      // Simulate verdict update
      await page.evaluate(() => {
        window.dispatchEvent(new CustomEvent('verdict-update', {
          detail: {
            submissionId: 'sub-1',
            status: 'WRONG_ANSWER',
            testResults: {
              totalTests: 5,
              passedTests: 2,
              testCases: [
                { id: 1, status: 'PASSED' },
                { id: 2, status: 'PASSED' },
                { id: 3, status: 'FAILED' },
                { id: 4, status: 'FAILED' },
                { id: 5, status: 'FAILED' },
              ],
            },
          },
        }));
      });

      // Now should show WRONG_ANSWER
      badge = page.locator('[data-testid="status-badge"]');
      await expect(badge).toContainText('WRONG_ANSWER', { timeout: 5000 });
    });
  });

  test.describe('Cross-View State Synchronization', () => {
    /**
     * TEST 5: Multiple submissions sync across views
     */
    test('should sync multiple submissions across all views', async () => {
      await page.goto('/contests/1/arena');

      // Submit first solution
      await page.route('**/api/contests/1/submit', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            success: true,
            data: { submissionId: 'sub-1', status: 'PENDING' },
          }),
        });
      });

      let editor = page.locator('.monaco-editor');
      await editor.click();
      await page.keyboard.type('attempt1');

      let submitButton = page.locator('[data-testid="submit-button"]');
      await submitButton.click();

      await page.waitForTimeout(300);

      // First submission verdict
      await page.evaluate(() => {
        window.dispatchEvent(new CustomEvent('verdict-update', {
          detail: { submissionId: 'sub-1', status: 'WRONG_ANSWER' },
        }));
      });

      // Verify first in history
      let submissions = page.locator('[data-testid="submission-row"]');
      await expect(submissions).toHaveCount(1);

      // Clear editor and submit second solution
      await page.waitForTimeout(200);

      await page.route('**/api/contests/1/submit', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            success: true,
            data: { submissionId: 'sub-2', status: 'PENDING' },
          }),
        });
      });

      editor = page.locator('.monaco-editor');
      await editor.click();
      await page.keyboard.press('Control+A');
      await page.keyboard.type('attempt2');

      submitButton = page.locator('[data-testid="submit-button"]');
      await submitButton.click();

      await page.waitForTimeout(300);

      // Second submission verdict
      await page.evaluate(() => {
        window.dispatchEvent(new CustomEvent('verdict-update', {
          detail: { submissionId: 'sub-2', status: 'ACCEPTED' },
        }));
      });

      // Verify both in history
      submissions = page.locator('[data-testid="submission-row"]');
      await expect(submissions).toHaveCount(2);

      // Most recent (ACCEPTED) should be first
      const firstRow = submissions.first();
      await expect(firstRow).toContainText('ACCEPTED');
    });

    /**
     * TEST 6: Compilation error syncs to all views
     */
    test('should show compilation error in all views', async () => {
      await page.goto('/contests/1/arena');

      await page.route('**/api/submissions/run', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            success: true,
            data: {
              id: 'sub-1',
              status: 'PENDING',
            },
          }),
        });
      });

      const editor = page.locator('.monaco-editor');
      await editor.click();
      await page.keyboard.type('def broken syntax');

      const runButton = page.locator('[data-testid="run-button"]');
      await runButton.click();

      // Simulate compilation error verdict
      await page.evaluate(() => {
        window.dispatchEvent(new CustomEvent('verdict-update', {
          detail: {
            submissionId: 'sub-1',
            status: 'COMPILATION_ERROR',
            compilationError: 'SyntaxError: invalid syntax at line 1',
          },
        }));
      });

      // Error should be visible
      const errorDisplay = page.locator('[data-testid="error-display"]');
      await expect(errorDisplay).toBeVisible({ timeout: 5000 });
      await expect(errorDisplay).toContainText('SyntaxError');

      // Should also appear in history with error indication
      const historyRow = page.locator('[data-testid="submission-row"]:has-text("COMPILATION_ERROR")');
      await expect(historyRow).toBeVisible({ timeout: 5000 });
    });

    /**
     * TEST 7: Runtime error syncs across views
     */
    test('should show runtime error in all views', async () => {
      await page.goto('/contests/1/arena');

      await page.route('**/api/submissions/run', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            success: true,
            data: { id: 'sub-1', status: 'PENDING' },
          }),
        });
      });

      const editor = page.locator('.monaco-editor');
      await editor.click();
      await page.keyboard.type('1/0');

      const runButton = page.locator('[data-testid="run-button"]');
      await runButton.click();

      // Simulate runtime error verdict
      await page.evaluate(() => {
        window.dispatchEvent(new CustomEvent('verdict-update', {
          detail: {
            submissionId: 'sub-1',
            status: 'RUNTIME_ERROR',
            runtimeError: 'ZeroDivisionError: division by zero',
          },
        }));
      });

      // Error should be visible
      const errorDisplay = page.locator('[data-testid="error-display"]');
      await expect(errorDisplay).toBeVisible({ timeout: 5000 });
      await expect(errorDisplay).toContainText('ZeroDivisionError');
    });

    /**
     * TEST 8: TLE verdict syncs to all views
     */
    test('should show time limit exceeded verdict', async () => {
      await page.goto('/contests/1/arena');

      await page.route('**/api/submissions/run', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            success: true,
            data: { id: 'sub-1', status: 'PENDING' },
          }),
        });
      });

      const editor = page.locator('.monaco-editor');
      await editor.click();
      await page.keyboard.type('while True: pass');

      const runButton = page.locator('[data-testid="run-button"]');
      await runButton.click();

      // Simulate TLE verdict
      await page.evaluate(() => {
        window.dispatchEvent(new CustomEvent('verdict-update', {
          detail: {
            submissionId: 'sub-1',
            status: 'TIME_LIMIT_EXCEEDED',
          },
        }));
      });

      const badge = page.locator('[data-testid="status-badge"]');
      await expect(badge).toContainText('TIME LIMIT', { timeout: 5000 });
    });
  });

  test.describe('Polling Fallback & Retries', () => {
    /**
     * TEST 9: Polling retrieves verdict if WebSocket fails
     */
    test('should fallback to polling if WebSocket fails', async () => {
      await page.goto('/contests/1/arena');

      let pollAttempts = 0;

      // Mock submission
      await page.route('**/api/contests/1/submit', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            success: true,
            data: { submissionId: 'sub-1', status: 'PENDING' },
          }),
        });
      });

      // Mock verdict polling endpoint
      await page.route('**/api/submissions/sub-1', async (route) => {
        pollAttempts++;
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            success: true,
            data: {
              status: pollAttempts >= 3 ? 'ACCEPTED' : 'PENDING',
            },
          }),
        });
      });

      const editor = page.locator('.monaco-editor');
      await editor.click();
      await page.keyboard.type('code');

      const submitButton = page.locator('[data-testid="submit-button"]');
      await submitButton.click();

      // Wait for polling to get the verdict
      await page.waitForTimeout(6000); // 2-second polling intervals

      const badge = page.locator('[data-testid="status-badge"]');
      await expect(badge).toContainText('ACCEPTED', { timeout: 10000 });

      expect(pollAttempts).toBeGreaterThanOrEqual(3);
    });

    /**
     * TEST 10: Retry on verdict retrieval failure
     */
    test('should retry verdict retrieval on failure', async () => {
      await page.goto('/contests/1/arena');

      let attempts = 0;

      await page.route('**/api/contests/1/submit', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            success: true,
            data: { submissionId: 'sub-1', status: 'PENDING' },
          }),
        });
      });

      // First 2 attempts fail, third succeeds
      await page.route('**/api/submissions/sub-1', async (route) => {
        attempts++;
        if (attempts <= 2) {
          await route.abort('failed');
        } else {
          await route.fulfill({
            status: 200,
            body: JSON.stringify({
              success: true,
              data: { status: 'ACCEPTED' },
            }),
          });
        }
      });

      const editor = page.locator('.monaco-editor');
      await editor.click();
      await page.keyboard.type('code');

      const submitButton = page.locator('[data-testid="submit-button"]');
      await submitButton.click();

      // Should eventually succeed
      const badge = page.locator('[data-testid="status-badge"]');
      await expect(badge).toContainText('ACCEPTED', { timeout: 15000 });

      expect(attempts).toBeGreaterThan(2);
    });
  });

  test.describe('Concurrent Submission Handling', () => {
    /**
     * TEST 11: Multiple concurrent submissions tracked correctly
     */
    test('should track incoming verdicts for multiple concurrent submissions', async () => {
      await page.goto('/contests/1/arena');

      let submissionCount = 0;

      await page.route('**/api/contests/1/submit', async (route) => {
        submissionCount++;
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            success: true,
            data: { submissionId: `sub-${submissionCount}`, status: 'PENDING' },
          }),
        });
      });

      // Submit code
      const editor = page.locator('.monaco-editor');

      // First submission
      await editor.click();
      await page.keyboard.type('attempt1');
      let submitButton = page.locator('[data-testid="submit-button"]');
      await submitButton.click();

      await page.waitForTimeout(100);

      // Second submission (without waiting for first verdict)
      await editor.click();
      await page.keyboard.press('Control+A');
      await page.keyboard.type('attempt2');
      submitButton = page.locator('[data-testid="submit-button"]');
      await submitButton.click();

      await page.waitForTimeout(100);

      // Verdicts arrive in different order
      await page.evaluate(() => {
        // Second verdict arrives first
        window.dispatchEvent(new CustomEvent('verdict-update', {
          detail: { submissionId: 'sub-2', status: 'ACCEPTED' },
        }));
      });

      await page.waitForTimeout(100);

      await page.evaluate(() => {
        // First verdict arrives late
        window.dispatchEvent(new CustomEvent('verdict-update', {
          detail: { submissionId: 'sub-1', status: 'WRONG_ANSWER' },
        }));
      });

      // Both should be in history
      const submissions = page.locator('[data-testid="submission-row"]');
      await expect(submissions).toHaveCount(2, { timeout: 5000 });
    });
  });
});
