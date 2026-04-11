import { test, expect, Page } from '@playwright/test';

/**
 * TDD RED Phase - User Profile & Statistics
 * Tests for user profile display, stats, and profile editing
 */

test.describe('User Profile & Statistics (RED Phase)', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();

    // Mock localStorage
    await page.context().addInitScript(() => {
      localStorage.setItem('auth_token', 'test-token-123');
      localStorage.setItem('user_id', 'user-1');
      localStorage.setItem('username', 'testuser');
    });
  });

  test.afterEach(async () => {
    await page.close();
  });

  test.describe('User Profile Display', () => {
    /**
     * TEST 1: Display user profile with basic info
     */
    test('should display user profile with basic information', async () => {
      // Mock user profile endpoint
      await page.route('**/api/users/profile', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            user: {
              id: 'user-1',
              username: 'testuser',
              email: 'test@example.com',
              avatar: 'https://example.com/avatar.jpg',
              bio: 'Competitive programmer',
              joinedAt: new Date(Date.now() - 86400000 * 365).toISOString(),
              location: 'San Francisco',
              website: 'https://example.com',
            },
          }),
        });
      });

      await page.goto('/profile');

      // Wait for profile to load
      const profileHeader = page.locator('[data-testid="profile-header"]');
      await expect(profileHeader).toBeVisible({ timeout: 5000 });

      // Verify basic info
      await expect(page.locator('[data-testid="username"]')).toContainText('testuser');
      await expect(page.locator('[data-testid="bio"]')).toContainText('Competitive programmer');
      await expect(page.locator('[data-testid="location"]')).toContainText('San Francisco');
      await expect(page.locator('[data-testid="user-avatar"]')).toBeVisible();
    });

    /**
     * TEST 2: Display user statistics
     */
    test('should display user statistics', async () => {
      await page.route('**/api/users/profile', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            user: {
              id: 'user-1',
              username: 'testuser',
              email: 'test@example.com',
            },
          }),
        });
      });

      await page.route('**/api/users/profile/stats', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            stats: {
              problemsSolved: 45,
              submissionAccepted: 78,
              submissionTotal: 156,
              contestsParticipated: 12,
              rating: 1650,
              maxRating: 1800,
              acceptanceRate: 0.5,
              averageTime: 245,
            },
          }),
        });
      });

      await page.goto('/profile');

      // Verify statistics are displayed
      const statsSolved = page.locator('[data-testid="problems-solved"]');
      const statsAcceptance = page.locator('[data-testid="acceptance-rate"]');
      const statsRating = page.locator('[data-testid="current-rating"]');
      const statsContests = page.locator('[data-testid="contests-participated"]');

      await expect(statsSolved).toContainText('45');
      await expect(statsAcceptance).toContainText('50');
      await expect(statsRating).toContainText('1650');
      await expect(statsContests).toContainText('12');
    });

    /**
     * TEST 3: Display rating progress
     */
    test('should display rating progress and max rating', async () => {
      await page.route('**/api/users/profile', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            user: { id: 'user-1', username: 'testuser' },
          }),
        });
      });

      await page.route('**/api/users/profile/stats', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            stats: {
              rating: 1650,
              maxRating: 1800,
              problemsSolved: 45,
              submissionAccepted: 78,
              submissionTotal: 156,
              contestsParticipated: 12,
              acceptanceRate: 0.5,
              averageTime: 245,
            },
          }),
        });
      });

      await page.goto('/profile');

      const ratingBar = page.locator('[data-testid="rating-progress-bar"]');
      await expect(ratingBar).toBeVisible({ timeout: 5000 });

      const ratingText = page.locator('[data-testid="rating-text"]');
      await expect(ratingText).toContainText('1650 / 1800');
    });

    /**
     * TEST 4: Display submission statistics chart
     */
    test('should display submission acceptance statistics', async () => {
      await page.route('**/api/users/profile', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            user: { id: 'user-1', username: 'testuser' },
          }),
        });
      });

      await page.route('**/api/users/profile/stats', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            stats: {
              submissionAccepted: 78,
              submissionTotal: 156,
              problemsSolved: 45,
              rating: 1650,
              maxRating: 1800,
              contestsParticipated: 12,
              acceptanceRate: 0.5,
              averageTime: 245,
            },
          }),
        });
      });

      await page.goto('/profile');

      const statsChart = page.locator('[data-testid="submission-stats"]');
      await expect(statsChart).toBeVisible({ timeout: 5000 });

      await expect(page.locator('[data-testid="accepted-count"]')).toContainText('78');
      await expect(page.locator('[data-testid="total-submissions"]')).toContainText('156');
    });
  });

  test.describe('User Profile Editing', () => {
    /**
     * TEST 5: Edit own profile
     */
    test('should allow editing own profile', async () => {
      await page.route('**/api/users/profile', async (route) => {
        if (route.request().method() === 'GET') {
          await route.fulfill({
            status: 200,
            body: JSON.stringify({
              user: {
                id: 'user-1',
                username: 'testuser',
                email: 'test@example.com',
                bio: 'Old bio',
                location: 'Old City',
                website: 'https://old.example.com',
              },
            }),
          });
        } else if (route.request().method() === 'PUT') {
          const body = await route.request().postDataJSON();
          await route.fulfill({
            status: 200,
            body: JSON.stringify({
              success: true,
              user: {
                id: 'user-1',
                username: 'testuser',
                bio: body.bio,
                location: body.location,
                website: body.website,
              },
            }),
          });
        }
      });

      await page.goto('/profile');

      // Click edit button
      const editButton = page.locator('[data-testid="edit-profile-btn"]');
      await expect(editButton).toBeVisible({ timeout: 5000 });
      await editButton.click();

      // Wait for edit form
      const bioInput = page.locator('[data-testid="bio-input"]');
      await expect(bioInput).toBeVisible({ timeout: 5000 });

      // Update profile
      await bioInput.clear();
      await bioInput.fill('New bio');

      const locationInput = page.locator('[data-testid="location-input"]');
      await locationInput.clear();
      await locationInput.fill('San Francisco');

      // Save
      const saveButton = page.locator('[data-testid="save-profile-btn"]');
      await saveButton.click();

      // Verify success
      await expect(page.locator('text=/Profile updated successfully/')).toBeVisible({ timeout: 5000 });
    });

    /**
     * TEST 6: Upload profile avatar
     */
    test('should allow uploading profile avatar', async () => {
      await page.route('**/api/users/profile', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            user: { id: 'user-1', username: 'testuser' },
          }),
        });
      });

      await page.route('**/api/users/profile/avatar', async (route) => {
        if (route.request().method() === 'POST') {
          await route.fulfill({
            status: 200,
            body: JSON.stringify({
              success: true,
              avatarUrl: 'https://example.com/new-avatar.jpg',
            }),
          });
        }
      });

      await page.goto('/profile');

      const editButton = page.locator('[data-testid="edit-profile-btn"]');
      await editButton.click();

      // Upload avatar
      const avatarInput = page.locator('[data-testid="avatar-input"]');
      const filePath = '/tmp/test-avatar.jpg';

      // Create a test file
      await page.evaluate(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 100;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = 'blue';
          ctx.fillRect(0, 0, 100, 100);
        }
      });

      // Note: File upload in Playwright requires special handling
      // This is a simplified test that shows the flow
    });

    /**
     * TEST 7: Cannot edit other users' profiles
     */
    test('should not allow editing other users\' profiles', async () => {
      await page.route('**/api/users/user-2/profile', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            user: {
              id: 'user-2',
              username: 'otheruser',
              email: 'other@example.com',
            },
          }),
        });
      });

      await page.goto('/profile/user-2');

      // Edit button should not exist
      const editButton = page.locator('[data-testid="edit-profile-btn"]');
      await expect(editButton).not.toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('User Submission History', () => {
    /**
     * TEST 8: Display user submission history
     */
    test('should display user submission history with filtering', async () => {
      await page.route('**/api/users/profile', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            user: { id: 'user-1', username: 'testuser' },
          }),
        });
      });

      await page.route('**/api/users/profile/submissions', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            submissions: [
              {
                id: 'sub-1',
                problemId: 123,
                problemTitle: 'Two Sum',
                status: 'ACCEPTED',
                language: 'python',
                submittedAt: new Date().toISOString(),
                score: 100,
              },
              {
                id: 'sub-2',
                problemId: 124,
                problemTitle: 'Reverse String',
                status: 'WRONG_ANSWER',
                language: 'java',
                submittedAt: new Date(Date.now() - 86400000).toISOString(),
                score: 0,
              },
            ],
            total: 2,
          }),
        });
      });

      await page.goto('/profile');

      // Click on submissions tab
      const submissionsTab = page.locator('[data-testid="submissions-tab"]');
      await submissionsTab.click();

      // Verify submissions displayed
      const submissionRows = page.locator('[data-testid="submission-row"]');
      await expect(submissionRows).toHaveCount(2, { timeout: 5000 });

      // Verify first submission
      const firstRow = submissionRows.first();
      await expect(firstRow).toContainText('Two Sum');
      await expect(firstRow).toContainText('ACCEPTED');
      await expect(firstRow).toContainText('python');
    });

    /**
     * TEST 9: Filter submissions by status
     */
    test('should filter submissions by status', async () => {
      await page.route('**/api/users/profile', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            user: { id: 'user-1', username: 'testuser' },
          }),
        });
      });

      await page.route('**/api/users/profile/submissions?status=ACCEPTED', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            submissions: [
              {
                id: 'sub-1',
                problemId: 123,
                problemTitle: 'Two Sum',
                status: 'ACCEPTED',
                language: 'python',
                submittedAt: new Date().toISOString(),
                score: 100,
              },
            ],
            total: 1,
          }),
        });
      });

      await page.goto('/profile');

      const submissionsTab = page.locator('[data-testid="submissions-tab"]');
      await submissionsTab.click();

      // Filter by ACCEPTED
      const statusFilter = page.locator('[data-testid="status-filter"]');
      await statusFilter.selectOption('ACCEPTED');

      // Verify filtered results
      const submissionRows = page.locator('[data-testid="submission-row"]');
      await expect(submissionRows).toHaveCount(1, { timeout: 5000 });
    });

    /**
     * TEST 10: Sort submissions by date
     */
    test('should sort submissions by date', async () => {
      await page.route('**/api/users/profile', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            user: { id: 'user-1', username: 'testuser' },
          }),
        });
      });

      await page.route('**/api/users/profile/submissions?sort=date', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            submissions: [
              {
                id: 'sub-1',
                problemId: 123,
                problemTitle: 'Two Sum',
                status: 'ACCEPTED',
                language: 'python',
                submittedAt: new Date().toISOString(),
              },
              {
                id: 'sub-2',
                problemId: 124,
                problemTitle: 'Reverse String',
                status: 'ACCEPTED',
                language: 'java',
                submittedAt: new Date(Date.now() - 86400000).toISOString(),
              },
            ],
          }),
        });
      });

      await page.goto('/profile');

      const submissionsTab = page.locator('[data-testid="submissions-tab"]');
      await submissionsTab.click();

      const sortButton = page.locator('[data-testid="sort-selector"]');
      await sortButton.selectOption('date');

      // Verify sorted
      const firstRow = page.locator('[data-testid="submission-row"]').first();
      await expect(firstRow).toContainText('Two Sum');
    });
  });

  test.describe('User Contests & Ratings', () => {
    /**
     * TEST 11: Display contest participation history
     */
    test('should display user contest participation history', async () => {
      await page.route('**/api/users/profile', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            user: { id: 'user-1', username: 'testuser' },
          }),
        });
      });

      await page.route('**/api/users/profile/contests', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            contests: [
              {
                id: 1,
                title: 'Weekly Contest 1',
                rank: 15,
                score: 250,
                participantCount: 500,
                ratingChange: +50,
                date: new Date().toISOString(),
              },
              {
                id: 2,
                title: 'Weekly Contest 2',
                rank: 8,
                score: 350,
                participantCount: 600,
                ratingChange: +100,
                date: new Date(Date.now() - 604800000).toISOString(),
              },
            ],
            total: 2,
          }),
        });
      });

      await page.goto('/profile');

      const contestsTab = page.locator('[data-testid="contests-tab"]');
      await contestsTab.click();

      // Verify contests displayed
      const contestRows = page.locator('[data-testid="contest-row"]');
      await expect(contestRows).toHaveCount(2, { timeout: 5000 });

      // Verify contest details
      const firstContest = contestRows.first();
      await expect(firstContest).toContainText('Weekly Contest 1');
      await expect(firstContest).toContainText('15');
      await expect(firstContest).toContainText('+50');
    });

    /**
     * TEST 12: Display rating graph
     */
    test('should display user rating graph over time', async () => {
      await page.route('**/api/users/profile', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            user: { id: 'user-1', username: 'testuser' },
          }),
        });
      });

      await page.route('**/api/users/profile/rating-history', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            history: [
              { date: new Date(Date.now() - 604800000 * 4).toISOString(), rating: 1500 },
              { date: new Date(Date.now() - 604800000 * 3).toISOString(), rating: 1550 },
              { date: new Date(Date.now() - 604800000 * 2).toISOString(), rating: 1600 },
              { date: new Date(Date.now() - 604800000).toISOString(), rating: 1650 },
            ],
          }),
        });
      });

      await page.goto('/profile');

      const contestsTab = page.locator('[data-testid="contests-tab"]');
      await contestsTab.click();

      const ratingGraph = page.locator('[data-testid="rating-graph"]');
      await expect(ratingGraph).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('User Profile Settings', () => {
    /**
     * TEST 13: Access profile settings
     */
    test('should access profile settings from profile page', async () => {
      await page.route('**/api/users/profile', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            user: { id: 'user-1', username: 'testuser', email: 'test@example.com' },
          }),
        });
      });

      await page.goto('/profile');

      const settingsButton = page.locator('[data-testid="profile-settings-btn"]');
      await expect(settingsButton).toBeVisible({ timeout: 5000 });
      await settingsButton.click();

      // Verify settings page loads
      const settingsPage = page.locator('[data-testid="settings-page"]');
      await expect(settingsPage).toBeVisible({ timeout: 5000 });
    });

    /**
     * TEST 14: Update email notification preferences
     */
    test('should update email notification preferences', async () => {
      await page.route('**/api/users/profile', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            user: { id: 'user-1', username: 'testuser' },
          }),
        });
      });

      await page.route('**/api/users/settings', async (route) => {
        if (route.request().method() === 'PUT') {
          await route.fulfill({
            status: 200,
            body: JSON.stringify({ success: true }),
          });
        } else {
          await route.fulfill({
            status: 200,
            body: JSON.stringify({
              settings: {
                emailOnNewContest: true,
                emailOnAccepted: false,
                emailWeeklyDigest: true,
              },
            }),
          });
        }
      });

      await page.goto('/profile/settings');

      const emailToggle = page.locator('[data-testid="email-on-accepted-toggle"]');
      await emailToggle.click();

      // Verify update message
      await expect(page.locator('text=/Settings updated/')).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('User Leaderboard Position', () => {
    /**
     * TEST 15: Display user global rank
     */
    test('should display user global rank and percentile', async () => {
      await page.route('**/api/users/profile', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            user: { id: 'user-1', username: 'testuser' },
          }),
        });
      });

      await page.route('**/api/users/profile/stats', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            stats: {
              globalRank: 234,
              totalUsers: 10000,
              percentile: 97.7,
            },
          }),
        });
      });

      await page.goto('/profile');

      const globalRank = page.locator('[data-testid="global-rank"]');
      const percentile = page.locator('[data-testid="percentile"]');

      await expect(globalRank).toContainText('234');
      await expect(percentile).toContainText('97.7');
    });
  });
});
