import { test, expect, Page } from '@playwright/test';

/**
 * TDD RED Phase - Real-time Contest Leaderboard
 * Tests for WebSocket-based live leaderboard updates
 */

test.describe('Contest Leaderboard - Real-time Updates (RED Phase)', () => {
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

  test.describe('Leaderboard Display', () => {
    /**
     * TEST 1: Leaderboard displays initial rankings
     */
    test('should display initial leaderboard with rankings', async () => {
      // Mock initial leaderboard data
      await page.route('**/api/contests/1/leaderboard', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            participants: [
              { rank: 1, username: 'alice', score: 300, solved: 3, lastSolveTime: new Date().toISOString() },
              { rank: 2, username: 'bob', score: 200, solved: 2, lastSolveTime: new Date().toISOString() },
              { rank: 3, username: 'charlie', score: 100, solved: 1, lastSolveTime: new Date().toISOString() },
            ],
          }),
        });
      });

      await page.goto('/contests/1/arena');

      // Wait for leaderboard to load
      const leaderboardTable = page.locator('[data-testid="leaderboard-table"]');
      await expect(leaderboardTable).toBeVisible({ timeout: 5000 });

      // Verify ranking display
      const rows = page.locator('[data-testid="leaderboard-row"]');
      await expect(rows).toHaveCount(3);

      // Verify first place
      const firstPlace = rows.first();
      await expect(firstPlace).toContainText('alice');
      await expect(firstPlace).toContainText('300');
    });

    /**
     * TEST 2: Leaderboard shows current user ranking
     */
    test('should highlight current user in leaderboard', async () => {
      await page.route('**/api/contests/1/leaderboard', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            participants: [
              { rank: 1, username: 'alice', score: 300, solved: 3 },
              { rank: 2, username: 'testuser', score: 200, solved: 2, isCurrentUser: true },
              { rank: 3, username: 'charlie', score: 100, solved: 1 },
            ],
          }),
        });
      });

      await page.goto('/contests/1/arena');

      const currentUserRow = page.locator('[data-testid="leaderboard-row"][data-current-user="true"]');
      await expect(currentUserRow).toBeVisible({ timeout: 5000 });
      await expect(currentUserRow).toHaveClass('bg-blue-50');
    });

    /**
     * TEST 3: Leaderboard displays problem counts
     */
    test('should display problems solved count for each participant', async () => {
      await page.route('**/api/contests/1/leaderboard', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            participants: [
              { rank: 1, username: 'alice', score: 300, solved: 3 },
              { rank: 2, username: 'bob', score: 200, solved: 2 },
            ],
          }),
        });
      });

      await page.goto('/contests/1/arena');

      const aliceRow = page.locator('[data-testid="leaderboard-row"]:has-text("alice")');
      await expect(aliceRow).toContainText('3');

      const bobRow = page.locator('[data-testid="leaderboard-row"]:has-text("bob")');
      await expect(bobRow).toContainText('2');
    });
  });

  test.describe('Real-time Updates via WebSocket', () => {
    /**
     * TEST 4: Leaderboard updates when participant solves problem
     */
    test('should update leaderboard when someone solves a problem', async () => {
      const ws = await page.evaluate(() => {
        return new Promise((resolve) => {
          const socket = io('http://localhost:3001', { reconnection: false });
          socket.on('connect', () => resolve(socket.id));
        });
      });

      await page.route('**/api/contests/1/leaderboard', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            participants: [
              { rank: 1, username: 'alice', score: 300, solved: 3 },
              { rank: 2, username: 'bob', score: 200, solved: 1 },
            ],
          }),
        });
      });

      await page.goto('/contests/1/arena');

      // Simulate WebSocket update (bob solved a problem)
      await page.evaluate(() => {
        window.testSocket?.emit('leaderboard-update', {
          participants: [
            { rank: 1, username: 'alice', score: 300, solved: 3 },
            { rank: 2, username: 'bob', score: 250, solved: 2 },
          ],
        });
      });

      // Wait for update to reflect
      await page.waitForTimeout(500);

      const bobRow = page.locator('[data-testid="leaderboard-row"]:has-text("bob")');
      await expect(bobRow).toContainText('250');
      await expect(bobRow).toContainText('2');
    });

    /**
     * TEST 5: Rankings change when scores change
     */
    test('should update rankings when participant overtakes another', async () => {
      await page.route('**/api/contests/1/leaderboard', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            participants: [
              { rank: 1, username: 'alice', score: 300, solved: 3 },
              { rank: 2, username: 'bob', score: 150, solved: 1 },
            ],
          }),
        });
      });

      await page.goto('/contests/1/arena');

      // Simulate WebSocket update (bob overtakes alice)
      await page.evaluate(() => {
        window.testSocket?.emit('leaderboard-update', {
          participants: [
            { rank: 1, username: 'bob', score: 350, solved: 2 },
            { rank: 2, username: 'alice', score: 300, solved: 3 },
          ],
        });
      });

      await page.waitForTimeout(500);

      const rows = page.locator('[data-testid="leaderboard-row"]');
      const firstRow = rows.first();

      await expect(firstRow).toContainText('bob');
      await expect(firstRow).toContainText('1');
    });

    /**
     * TEST 6: New participant appears in leaderboard
     */
    test('should add new participant to leaderboard', async () => {
      await page.route('**/api/contests/1/leaderboard', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            participants: [
              { rank: 1, username: 'alice', score: 300, solved: 3 },
            ],
          }),
        });
      });

      await page.goto('/contests/1/arena');

      let rows = page.locator('[data-testid="leaderboard-row"]');
      await expect(rows).toHaveCount(1);

      // Simulate new participant joining
      await page.evaluate(() => {
        window.testSocket?.emit('leaderboard-update', {
          participants: [
            { rank: 1, username: 'alice', score: 300, solved: 3 },
            { rank: 2, username: 'david', score: 200, solved: 2 },
          ],
        });
      });

      await page.waitForTimeout(500);

      rows = page.locator('[data-testid="leaderboard-row"]');
      await expect(rows).toHaveCount(2);

      const davidRow = page.locator('[data-testid="leaderboard-row"]:has-text("david")');
      await expect(davidRow).toContainText('2');
    });

    /**
     * TEST 7: Leaderboard refresh happens automatically
     */
    test('should auto-refresh leaderboard every 5 seconds', async () => {
      let callCount = 0;
      await page.route('**/api/contests/1/leaderboard', async (route) => {
        callCount++;
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            participants: [
              { rank: 1, username: 'alice', score: 300, solved: 3 },
            ],
          }),
        });
      });

      await page.goto('/contests/1/arena');

      const initialCount = callCount;

      // Wait 6 seconds for auto-refresh
      await page.waitForTimeout(6000);

      const finalCount = callCount;
      expect(finalCount).toBeGreaterThan(initialCount);
    });

    /**
     * TEST 8: Current user position updates in real-time
     */
    test('should update current user rank in real-time', async () => {
      await page.route('**/api/contests/1/leaderboard', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            participants: [
              { rank: 1, username: 'alice', score: 300, solved: 3 },
              { rank: 2, username: 'testuser', score: 200, solved: 2, isCurrentUser: true },
            ],
          }),
        });
      });

      await page.goto('/contests/1/arena');

      let userRank = page.locator('[data-testid="leaderboard-row"][data-current-user="true"] [data-testid="rank"]');
      await expect(userRank).toContainText('2');

      // Simulate testuser solving a problem and overtaking alice
      await page.evaluate(() => {
        window.testSocket?.emit('leaderboard-update', {
          participants: [
            { rank: 1, username: 'testuser', score: 350, solved: 3, isCurrentUser: true },
            { rank: 2, username: 'alice', score: 300, solved: 3 },
          ],
        });
      });

      await page.waitForTimeout(500);

      userRank = page.locator('[data-testid="leaderboard-row"][data-current-user="true"] [data-testid="rank"]');
      await expect(userRank).toContainText('1');
    });
  });

  test.describe('Leaderboard Pagination & Performance', () => {
    /**
     * TEST 9: Leaderboard pagination for large number of participants
     */
    test('should paginate leaderboard if more than 10 participants', async () => {
      const participants = Array.from({ length: 25 }, (_, i) => ({
        rank: i + 1,
        username: `user${i + 1}`,
        score: 300 - i * 10,
        solved: 3 - Math.floor(i / 8),
      }));

      await page.route('**/api/contests/1/leaderboard*', async (route) => {
        const page = new URL(route.request().url()).searchParams.get('page') || '1';
        const pageNum = parseInt(page);
        const pageSize = 10;
        const start = (pageNum - 1) * pageSize;
        const end = start + pageSize;

        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            participants: participants.slice(start, end),
            total: participants.length,
            page: pageNum,
          }),
        });
      });

      await page.goto('/contests/1/arena');

      // Check first page
      let rows = page.locator('[data-testid="leaderboard-row"]');
      await expect(rows).toHaveCount(10);

      // Go to next page
      const nextButton = page.locator('[data-testid="leaderboard-next-page"]');
      await expect(nextButton).toBeVisible();
      await nextButton.click();

      // Check second page
      rows = page.locator('[data-testid="leaderboard-row"]');
      await expect(rows).toHaveCount(10);

      const firstUserOnPage2 = rows.first();
      await expect(firstUserOnPage2).toContainText('user11');
    });

    /**
     * TEST 10: Leaderboard handles network errors gracefully
     */
    test('should show error state if leaderboard fetch fails', async () => {
      await page.route('**/api/contests/1/leaderboard', async (route) => {
        await route.abort('failed');
      });

      await page.goto('/contests/1/arena');

      const errorState = page.locator('[data-testid="leaderboard-error"]');
      await expect(errorState).toBeVisible({ timeout: 5000 });
      await expect(errorState).toContainText('Failed to load leaderboard');
    });
  });

  test.describe('Leaderboard Animations & UX', () => {
    /**
     * TEST 11: Rank change animates smoothly
     */
    test('should animate rank changes', async () => {
      await page.route('**/api/contests/1/leaderboard', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            participants: [
              { rank: 1, username: 'alice', score: 300, solved: 3 },
              { rank: 2, username: 'bob', score: 200, solved: 2 },
            ],
          }),
        });
      });

      await page.goto('/contests/1/arena');

      // Simulate rank change
      await page.evaluate(() => {
        window.testSocket?.emit('leaderboard-update', {
          participants: [
            { rank: 1, username: 'bob', score: 350, solved: 3 },
            { rank: 2, username: 'alice', score: 300, solved: 3 },
          ],
        });
      });

      // Check for animation class
      const bobRow = page.locator('[data-testid="leaderboard-row"]:has-text("bob")');
      const animatingClass = await bobRow.evaluate((el) =>
        el.classList.contains('animate-rank-change'),
      );

      expect(animatingClass).toBe(true);
    });

    /**
     * TEST 12: Score changes highlight in real-time
     */
    test('should highlight score changes', async () => {
      await page.route('**/api/contests/1/leaderboard', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            participants: [
              { rank: 1, username: 'alice', score: 300, solved: 3 },
            ],
          }),
        });
      });

      await page.goto('/contests/1/arena');

      // Simulate score change
      await page.evaluate(() => {
        window.testSocket?.emit('leaderboard-update', {
          participants: [
            { rank: 1, username: 'alice', score: 350, solved: 4 },
          ],
        });
      });

      // Check for highlight class
      const scoreCell = page.locator('[data-testid="leaderboard-score"]:has-text("350")');
      const highlightClass = await scoreCell.evaluate((el) =>
        el.classList.contains('animate-highlight'),
      );

      expect(highlightClass).toBe(true);
    });
  });
});
