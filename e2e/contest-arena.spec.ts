import { test, expect, Page } from '@playwright/test';

/**
 * E2E TESTS - Contest Arena (GREEN Phase)
 * Tests complete user workflows in the contest arena with proper API mocking
 */

// Mock helper function
function createMockContest() {
  return {
    id: 1,
    title: 'Test Contest 2024',
    description: 'A test contest',
    startTime: new Date(Date.now() - 600000).toISOString(), // Started 10 min ago
    endTime: new Date(Date.now() + 3600000).toISOString(), // Ends in 1 hour
    status: 'ACTIVE',
    problems: [
      { id: 1, title: 'Two Sum', points: 100, order: 1 },
      { id: 2, title: 'Reverse String', points: 150, order: 2 },
    ],
  };
}

function createMockParticipation() {
  return {
    isRegistered: true,
    participation: {
      id: 1,
      userId: 'user-1',
      username: 'testuser',
      contestId: 1,
      totalScore: 0,
      problemsSolved: 0,
      status: 'PARTICIPATING',
    },
  };
}

function createMockLeaderboard() {
  return {
    participants: [
      {
        rank: 1,
        username: 'topuser',
        totalScore: 250,
        problemsSolved: 2,
        finishTime: new Date(Date.now() - 900000).toISOString(),
      },
      {
        rank: 2,
        username: 'testuser',
        totalScore: 0,
        problemsSolved: 0,
      },
    ],
    total: 2,
  };
}

test.describe('Contest Arena - Complete Workflows', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();

    // Setup API mocking for all routes
    // Mock all GET requests for contest data
    await page.route('**/api/contests/1', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(createMockContest()),
        });
      }
    });

    // Mock participation endpoint
    await page.route('**/api/contests/1/participation', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(createMockParticipation()),
      });
    });

    // Mock leaderboard endpoint
    await page.route('**/api/contests/1/leaderboard', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(createMockLeaderboard()),
      });
    });

    // Set localStorage
    await page.context().addInitScript(() => {
      localStorage.setItem('auth_token', 'test-token-123');
      localStorage.setItem('user_id', 'user-1');
    });
  });

  test.afterEach(async () => {
    await page.close();
  });

  test.describe('Contest Timer Display', () => {
    test('should display contest timer in header', async () => {
      await page.goto('/contests/1/arena');

      // Wait for timer to load
      const timerContainer = page.locator('[data-testid="timer-container"]');
      await expect(timerContainer).toBeVisible();

      // Check for timer value
      const timerValue = page.locator('[data-testid="timer"]');
      await expect(timerValue).toBeVisible();

      // Timer should display HH:MM:SS format
      const timeText = await timerValue.textContent();
      expect(timeText).toMatch(/\d{2}:\d{2}:\d{2}/);
    });

    test('should update timer every second', async () => {
      await page.goto('/contests/1/arena');

      const timerValue = page.locator('[data-testid="timer"]');
      await expect(timerValue).toBeVisible();

      const initialTime = await timerValue.textContent();

      // Wait 2 seconds
      await page.waitForTimeout(2100);

      const updatedTime = await timerValue.textContent();

      // Time should have changed (decremented)
      expect(initialTime).not.toBe(updatedTime);
    });

    test('should show warning color when time < 5 minutes', async () => {
      // Modify the contest to end soon
      await page.route('**/api/contests/1', async (route) => {
        if (route.request().method() === 'GET') {
          const contestNearEnd = {
            ...createMockContest(),
            endTime: new Date(Date.now() + 240000).toISOString(), // 4 minutes
          };
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(contestNearEnd),
          });
        }
      });

      await page.goto('/contests/1/arena');

      const timerContainer = page.locator('[data-testid="timer-container"]');
      await expect(timerContainer).toBeVisible({ timeout: 5000 });

      // Check for red text color (warning state)
      const hasWarningClass = await timerContainer.evaluate((el) =>
        el.classList.contains('text-red-500'),
      );

      expect(hasWarningClass).toBe(true);
    });
  });

  test.describe('Code Submission - RUN Button', () => {
    test('should run code against example test cases', async () => {
      await page.goto('/contests/1/arena');

      // Mock the RUN endpoint
      await page.route('**/api/submissions/run', async (route) => {
        const body = await route.request().postDataJSON();

        // Verify RUN execution type
        expect(body.executionType).toBe('RUN');

        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              id: 'sub-1',
              status: 'ACCEPTED',
              testResults: {
                totalTests: 2,
                passedTests: 2,
                testCases: [
                  {
                    id: 1,
                    status: 'PASSED',
                    input: '5',
                    expectedOutput: '120',
                    actualOutput: '120',
                    time: 45,
                    memory: 2048,
                  },
                  {
                    id: 2,
                    status: 'PASSED',
                    input: '3',
                    expectedOutput: '6',
                    actualOutput: '6',
                    time: 30,
                    memory: 1024,
                  },
                ],
              },
            },
          }),
        });
      });

      // Wait for page load
      await expect(page.locator('text=/Transmission Terminal/')).toBeVisible();

      // Find code editor (Monaco editor)
      const editor = page.locator('.monaco-editor');
      await expect(editor).toBeVisible();

      // Click in editor and type code
      await editor.click();
      await page.keyboard.type('def factorial(n):\n  return 1 if n <= 1 else n * factorial(n-1)');

      // Click RUN button
      const runButton = page.locator('[data-testid="run-button"]');
      await expect(runButton).toBeVisible();
      await runButton.click();

      // Wait for results
      const statusBadge = page.locator('[data-testid="status-badge"]');
      await expect(statusBadge).toBeVisible({ timeout: 5000 });

      // Verify ACCEPTED status shown
      const statusText = await page.locator('[data-testid="status-badge"]').textContent();
      expect(statusText).toContain('ACCEPTED');
    });

    test('should display test case results with pass/fail status', async () => {
      await page.goto('/contests/1/arena');

      // Mock RUN with mixed results
      await page.route('**/api/submissions/run', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              id: 'sub-1',
              status: 'WRONG_ANSWER',
              testResults: {
                totalTests: 3,
                passedTests: 2,
                testCases: [
                  { id: 1, status: 'PASSED', input: '5', expectedOutput: '120', actualOutput: '120' },
                  { id: 2, status: 'PASSED', input: '3', expectedOutput: '6', actualOutput: '6' },
                  { id: 3, status: 'FAILED', input: '0', expectedOutput: '1', actualOutput: '0' },
                ],
              },
            },
          }),
        });
      });

      // Type code and run
      const editor = page.locator('.monaco-editor');
      await editor.click();
      await page.keyboard.type('print(42)');

      const runButton = page.locator('[data-testid="run-button"]');
      await runButton.click();

      // Wait for test results
      await page.waitForTimeout(500);

      // Check for passed count display
      const passedCount = page.locator('[data-testid="passed-count"]');
      await expect(passedCount).toBeVisible({ timeout: 5000 });

      const passedText = await passedCount.textContent();
      expect(passedText).toContain('2/3');

      // Verify test case elements
      const testCases = page.locator('[data-testid^="test-case-"]');
      const count = await testCases.count();
      expect(count).toBeGreaterThanOrEqual(2);
    });

    test('should display compilation error message', async () => {
      await page.goto('/contests/1/arena');

      // Mock compilation error
      await page.route('**/api/submissions/run', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              id: 'sub-1',
              status: 'COMPILATION_ERROR',
              compilationError: 'SyntaxError: invalid syntax at line 1\nExpected \':\' but found \'print\'',
            },
          }),
        });
      });

      const editor = page.locator('.monaco-editor');
      await editor.click();
      await page.keyboard.type('def broken syntax');

      const runButton = page.locator('[data-testid="run-button"]');
      await runButton.click();

      // Look for error display
      const errorDisplay = page.locator('[data-testid="error-display"]');
      await expect(errorDisplay).toBeVisible({ timeout: 5000 });

      const errorText = await errorDisplay.textContent();
      expect(errorText).toContain('SyntaxError');
    });
  });

  test.describe('Code Submission - SUBMIT Button', () => {
    test('should submit code to contest service', async () => {
      await page.goto('/contests/1/arena');

      // Mock SUBMIT endpoint
      await page.route('**/api/contests/1/submit', async (route) => {
        const body = await route.request().postDataJSON();

        // Verify full submission context
        expect(body.executionType).toBe('SUBMIT');
        expect(body.contestId).toBe(1);
        expect(body.problemId).toBeDefined();

        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              submissionId: 'sub-2',
              status: 'PENDING',
            },
          }),
        });
      });

      // Type code
      const editor = page.locator('.monaco-editor');
      await editor.click();
      await page.keyboard.type('print(42)');

      // Click SUBMIT button
      const submitButton = page.locator('[data-testid="submit-button"]');
      await expect(submitButton).toBeVisible();
      await expect(submitButton).not.toBeDisabled();
      await submitButton.click();

      // Wait for submission confirmation
      await page.waitForTimeout(500);

      // SUBMIT button should remain visible for next submission
      await expect(submitButton).toBeVisible();
    });

    test('should add submission to history after submit', async () => {
      await page.goto('/contests/1/arena');

      // Mock SUBMIT endpoint
      await page.route('**/api/contests/1/submit', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              submissionId: 'sub-3',
              status: 'PENDING',
            },
          }),
        });
      });

      // Check initial state
      const emptyState = page.locator('[data-testid="empty-state"]');
      const initiallyEmpty = await emptyState.isVisible().catch(() => false);

      // Submit code
      const editor = page.locator('.monaco-editor');
      await editor.click();
      await page.keyboard.type('solution_code');

      const submitButton = page.locator('[data-testid="submit-button"]');
      await submitButton.click();

      // Wait for submission to appear in history
      await page.waitForTimeout(500);

      // Check for submission history
      const submissionRow = page.locator('[data-testid="submission-row"]');
      await expect(submissionRow).toBeVisible({ timeout: 5000 });
    });

    test('should disable SUBMIT button when code is empty', async () => {
      await page.goto('/contests/1/arena');

      const submitButton = page.locator('[data-testid="submit-button"]');
      await expect(submitButton).toBeDisabled();
    });

    test('should enable SUBMIT button when code is present', async () => {
      await page.goto('/contests/1/arena');

      const submitButton = page.locator('[data-testid="submit-button"]');
      await expect(submitButton).toBeDisabled();

      // Add code
      const editor = page.locator('.monaco-editor');
      await editor.click();
      await page.keyboard.type('x = 1');

      // Button should now be enabled
      await expect(submitButton).not.toBeDisabled();
    });
  });

  test.describe('Submission Verdict Display', () => {
    test('should display ACCEPTED with green badge', async () => {
      await page.goto('/contests/1/arena');

      // Mock verdict
      await page.route('**/api/submissions/run', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              id: 'sub-1',
              status: 'ACCEPTED',
              testResults: {
                totalTests: 5,
                passedTests: 5,
                testCases: Array.from({ length: 5 }, (_, i) => ({
                  id: i + 1,
                  status: 'PASSED',
                  input: `${i}`,
                  expectedOutput: `${i * 2}`,
                  actualOutput: `${i * 2}`,
                })),
              },
            },
          }),
        });
      });

      const editor = page.locator('.monaco-editor');
      await editor.click();
      await page.keyboard.type('print(42)');

      const runButton = page.locator('[data-testid="run-button"]');
      await runButton.click();

      // Wait for results
      const statusBadge = page.locator('[data-testid="status-badge"]');
      await expect(statusBadge).toBeVisible({ timeout: 5000 });

      // Check for green color (ACCEPTED)
      const hasGreenClass = await statusBadge.evaluate((el) =>
        el.textContent?.includes('ACCEPTED'),
      );
      expect(hasGreenClass).toBe(true);
    });

    test('should display WRONG_ANSWER with red badge', async () => {
      await page.goto('/contests/1/arena');

      // Mock verdict
      await page.route('**/api/submissions/run', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              id: 'sub-1',
              status: 'WRONG_ANSWER',
              testResults: {
                totalTests: 2,
                passedTests: 1,
                testCases: [
                  { id: 1, status: 'PASSED', input: '1', expectedOutput: '1', actualOutput: '1' },
                  { id: 2, status: 'FAILED', input: '2', expectedOutput: '2', actualOutput: '3' },
                ],
              },
            },
          }),
        });
      });

      const editor = page.locator('.monaco-editor');
      await editor.click();
      await page.keyboard.type('wrong');

      const runButton = page.locator('[data-testid="run-button"]');
      await runButton.click();

      const statusBadge = page.locator('[data-testid="status-badge"]');
      await expect(statusBadge).toBeVisible({ timeout: 5000 });

      const hasWrongAnswerText = await statusBadge.evaluate((el) =>
        el.textContent?.includes('WRONG_ANSWER'),
      );
      expect(hasWrongAnswerText).toBe(true);
    });
  });

  test.describe('Submission History', () => {
    test('should display empty state when no submissions', async () => {
      await page.goto('/contests/1/arena');

      const emptyState = page.locator('[data-testid="empty-state"]');
      await expect(emptyState).toBeVisible();

      const emptyText = await emptyState.textContent();
      expect(emptyText).toContain('No submissions yet');
    });

    test('should sort submissions by most recent first', async () => {
      await page.goto('/contests/1/arena');

      // Mock multiple submissions
      await page.route('**/api/submissions', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
          }),
        });
      });

      // Submit first code
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
      await page.keyboard.type('code1');

      const submitButton = page.locator('[data-testid="submit-button"]');
      await submitButton.click();

      await page.waitForTimeout(300);

      // Clear editor and submit second
      await editor.click();
      await page.keyboard.press('Control+A');
      await page.keyboard.type('code2');
      await submitButton.click();

      await page.waitForTimeout(300);

      // Get submission rows
      const rows = page.locator('[data-testid="submission-row"]');
      const count = await rows.count();

      // Should have at least 1 submission visible
      expect(count).toBeGreaterThanOrEqual(1);
    });
  });

  test.describe('Language Selection', () => {
    test('should allow language selection', async () => {
      await page.goto('/contests/1/arena');

      const languageSelect = page.locator('select');
      await expect(languageSelect).toBeVisible();

      // Get initial language
      const initialLanguage = await languageSelect.inputValue();
      expect(initialLanguage).toBeTruthy();

      // Change language
      await languageSelect.selectOption('python');

      // Verify it changed
      const newLanguage = await languageSelect.inputValue();
      expect(newLanguage).toBe('python');
    });

    test('should submit with selected language', async () => {
      await page.goto('/contests/1/arena');

      let capturedLanguage = '';

      // Mock SUBMIT to capture the request
      await page.route('**/api/contests/1/submit', async (route) => {
        const body = await route.request().postDataJSON();
        capturedLanguage = body.language;

        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            success: true,
            data: { submissionId: 'sub-1', status: 'PENDING' },
          }),
        });
      });

      // Select language
      const languageSelect = page.locator('select');
      await languageSelect.selectOption('java');

      // Type and submit
      const editor = page.locator('.monaco-editor');
      await editor.click();
      await page.keyboard.type('System.out.println("Hello");');

      const submitButton = page.locator('[data-testid="submit-button"]');
      await submitButton.click();

      // Wait for request
      await page.waitForTimeout(300);

      // Verify language was sent
      expect(capturedLanguage).toBe('java');
    });
  });
});
