import { test, expect } from '@playwright/test';

test.describe('Social Features - Follow System (RED Phase)', () => {
  test.describe('Follow/Unfollow Users', () => {
    test('should display follow button on user profile', async ({ page }) => {
      await page.goto('/profile/other-user-123');

      expect(await page.locator('[data-testid="follow-btn"]').isVisible()).toBeTruthy();
    });

    test('should follow user and update button state', async ({ page }) => {
      await page.goto('/profile/other-user-123');

      await page.route('**/api/users/*/follow', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({ followed: true }),
        });
      });

      const followBtn = page.locator('[data-testid="follow-btn"]');
      await followBtn.click();

      expect(await followBtn.textContent()).toBe('Unfollow');
      expect(await page.locator('[data-testid="follow-success-toast"]').isVisible()).toBeTruthy();
    });

    test('should unfollow user', async ({ page }) => {
      await page.goto('/profile/other-user-123');

      await page.route('**/api/users/*/unfollow', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({ unfollowed: true }),
        });
      });

      const followBtn = page.locator('[data-testid="follow-btn"]');
      await followBtn.click();

      expect(await followBtn.textContent()).toBe('Follow');
      expect(await page.locator('[data-testid="unfollow-success"]').isVisible()).toBeTruthy();
    });

    test('should not show follow button on own profile', async ({ page }) => {
      await page.goto('/profile');

      expect(await page.locator('[data-testid="follow-btn"]').isVisible()).toBeFalsy();
      expect(await page.locator('[data-testid="edit-profile-btn"]').isVisible()).toBeTruthy();
    });
  });

  test.describe('Followers List', () => {
    test('should display followers count and list', async ({ page }) => {
      await page.goto('/profile/user-123');

      await page.route('**/api/users/*/followers*', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            data: [
              { id: 1, username: 'user1', avatar: 'avatar1.jpg' },
              { id: 2, username: 'user2', avatar: 'avatar2.jpg' },
              { id: 3, username: 'user3', avatar: 'avatar3.jpg' },
            ],
            total: 3,
          }),
        });
      });

      await page.click('[data-testid="followers-count-btn"]');

      expect(await page.locator('[data-testid="followers-modal"]').isVisible()).toBeTruthy();
      expect(await page.locator('[data-testid="follower-user1"]').isVisible()).toBeTruthy();
      expect(await page.locator('text=3').isVisible()).toBeTruthy();
    });

    test('should display following list', async ({ page }) => {
      await page.goto('/profile/user-123');

      await page.route('**/api/users/*/following*', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            data: [
              { id: 10, username: 'expert1' },
              { id: 11, username: 'expert2' },
            ],
            total: 2,
          }),
        });
      });

      await page.click('[data-testid="following-count-btn"]');

      expect(await page.locator('[data-testid="following-modal"]').isVisible()).toBeTruthy();
      expect(await page.locator('text=expert1').isVisible()).toBeTruthy();
    });

    test('should unfollow from followers list', async ({ page }) => {
      await page.goto('/profile/user-123');

      await page.route('**/api/users/*/followers*', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            data: [{ id: 1, username: 'user1' }],
            total: 1,
          }),
        });
      });

      await page.route('**/api/users/*/unfollow', async (route) => {
        await route.fulfill({ status: 200 });
      });

      await page.click('[data-testid="followers-count-btn"]');
      await page.click('[data-testid="unfollow-from-list-1"]');

      expect(await page.locator('[data-testid="unfollow-success"]').isVisible()).toBeTruthy();
    });

    test('should paginate followers', async ({ page }) => {
      await page.goto('/profile/user-123');

      await page.route('**/api/users/*/followers*', async (route) => {
        const url = new URL(route.request().url());
        const page = url.searchParams.get('page') || '1';

        if (page === '1') {
          await route.fulfill({
            status: 200,
            body: JSON.stringify({
              data: Array.from({ length: 10 }, (_, i) => ({ id: i, username: `user${i}` })),
              total: 25,
            }),
          });
        } else {
          await route.fulfill({
            status: 200,
            body: JSON.stringify({
              data: Array.from({ length: 10 }, (_, i) => ({ id: i + 10, username: `user${i + 10}` })),
              total: 25,
            }),
          });
        }
      });

      await page.click('[data-testid="followers-count-btn"]');
      await page.click('[data-testid="next-follower-page"]');

      expect(await page.locator('[data-testid="follower-user10"]').isVisible()).toBeTruthy();
    });
  });

  test.describe('Follower Rankings/Leaderboard', () => {
    test('should display top followers ranking', async ({ page }) => {
      await page.goto('/followers-leaderboard');

      await page.route('**/api/leaderboard/followers*', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            data: [
              { rank: 1, username: 'topuser', followerCount: 5000, rating: 2500 },
              { rank: 2, username: 'secondplace', followerCount: 4500, rating: 2400 },
              { rank: 3, username: 'thirdplace', followerCount: 4000, rating: 2300 },
            ],
            total: 3,
          }),
        });
      });

      expect(await page.locator('[data-testid="followers-leaderboard"]').isVisible()).toBeTruthy();
      expect(await page.locator('text=topuser').isVisible()).toBeTruthy();
      expect(await page.locator('text=5000').isVisible()).toBeTruthy();
    });

    test('should highlight current user in leaderboard', async ({ page }) => {
      await page.goto('/followers-leaderboard');

      await page.route('**/api/leaderboard/followers*', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            data: [
              { rank: 1, username: 'topuser', followerCount: 5000 },
              { rank: 50, username: 'currentuser', followerCount: 100, isCurrentUser: true },
            ],
            total: 1000,
          }),
        });
      });

      const currentUserRow = page.locator('[data-testid="leaderboard-row-currentuser"]');
      expect(await currentUserRow.locator('[data-testid="current-user-badge"]').isVisible()).toBeTruthy();
    });
  });

  test.describe('Follow Notifications', () => {
    test('should notify when someone follows user', async ({ page }) => {
      await page.goto('/dashboard');

      await page.route('**/api/notifications*', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            data: [
              {
                id: 1,
                type: 'NEW_FOLLOWER',
                message: 'user123 started following you',
                read: false,
              },
            ],
            total: 1,
          }),
        });
      });

      expect(await page.locator('[data-testid="follower-notification"]').isVisible()).toBeTruthy();
    });

    test('should dismiss follow notification', async ({ page }) => {
      await page.goto('/notifications');

      await page.route('**/api/notifications/*/dismiss', async (route) => {
        await route.fulfill({ status: 200 });
      });

      await page.click('[data-testid="dismiss-notification"]');

      expect(await page.locator('[data-testid="notification-dismissed"]').isVisible()).toBeTruthy();
    });

    test('should show mutual follow indicator', async ({ page }) => {
      await page.goto('/profile/mutual-follower');

      await page.route('**/api/users/*/follow-status', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            isFollowing: true,
            isFollowedBy: true,
          }),
        });
      });

      expect(
        await page.locator('[data-testid="mutual-follow-badge"]').isVisible(),
      ).toBeTruthy();
    });
  });

  test.describe('Follow Recommendations', () => {
    test('should suggest users to follow', async ({ page }) => {
      await page.goto('/discover/users');

      await page.route('**/api/users/suggestions*', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            data: [
              {
                id: 1,
                username: 'expert1',
                rating: 2500,
                problemsSolved: 500,
                reason: 'Popular in your interests',
              },
              {
                id: 2,
                username: 'expert2',
                rating: 2400,
                problemsSolved: 450,
                reason: 'Friends are following them',
              },
            ],
            total: 2,
          }),
        });
      });

      expect(
        await page.locator('[data-testid="follow-suggestions-section"]').isVisible(),
      ).toBeTruthy();
      expect(await page.locator('text=expert1').isVisible()).toBeTruthy();
    });

    test('should show recommendation reason', async ({ page }) => {
      await page.goto('/discover/users');

      await page.route('**/api/users/suggestions*', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            data: [
              {
                id: 1,
                username: 'expert',
                reason: 'Popular in Array problems',
              },
            ],
          }),
        });
      });

      expect(await page.locator('text=Popular in Array problems').isVisible()).toBeTruthy();
    });

    test('should dismiss follow suggestion', async ({ page }) => {
      await page.goto('/discover/users');

      await page.route('**/api/users/suggestions/*/dismiss', async (route) => {
        await route.fulfill({ status: 200 });
      });

      await page.click('[data-testid="dismiss-suggestion"]');

      expect(await page.locator('[data-testid="suggestion-dismissed"]').isVisible()).toBeTruthy();
    });
  });

  test.describe('Activity Feeds - Following Activity', () => {
    test('should display following activity feed', async ({ page }) => {
      await page.goto('/feed/following');

      await page.route('**/api/feed/following*', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            data: [
              {
                id: 1,
                type: 'SOLVED_PROBLEM',
                actor: 'user1',
                problem: 'Two Sum',
                timestamp: '2024-01-15T10:00:00Z',
              },
              {
                id: 2,
                type: 'CONTEST_PARTICIPATION',
                actor: 'user2',
                contest: 'Weekly Contest 1',
                rank: 5,
                timestamp: '2024-01-15T09:00:00Z',
              },
            ],
            total: 2,
          }),
        });
      });

      expect(await page.locator('[data-testid="activity-feed"]').isVisible()).toBeTruthy();
      expect(await page.locator('text=Two Sum').isVisible()).toBeTruthy();
    });

    test('should filter activity by type', async ({ page }) => {
      await page.goto('/feed/following');

      await page.route('**/api/feed/following*', async (route) => {
        if (route.request().url().includes('type=SOLVED_PROBLEM')) {
          await route.fulfill({
            status: 200,
            body: JSON.stringify({
              data: [
                {
                  id: 1,
                  type: 'SOLVED_PROBLEM',
                  actor: 'user1',
                  problem: 'Problem',
                },
              ],
            }),
          });
        }
      });

      await page.click('[data-testid="filter-problems-solved"]');

      expect(await page.locator('[data-testid="activity-item"]').count()).toBeGreaterThan(0);
    });

    test('should show infinite scroll on activity feed', async ({ page }) => {
      await page.goto('/feed/following');

      await page.route('**/api/feed/following*', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            data: Array.from({ length: 20 }, (_, i) => ({
              id: i,
              type: 'SOLVED_PROBLEM',
              actor: `user${i}`,
            })),
            total: 100,
          }),
        });
      });

      // Scroll to bottom
      await page.evaluate(() => {
        window.scrollBy(0, window.innerHeight * 10);
      });

      // Should load more items
      expect(
        await page.locator('[data-testid="activity-item"]').count(),
      ).toBeGreaterThanOrEqual(20);
    });
  });

  test.describe('Global Activity Feed', () => {
    test('should display global trending activity', async ({ page }) => {
      await page.goto('/feed/global');

      await page.route('**/api/feed/global*', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            data: [
              { id: 1, type: 'CONTEST_ENDED', title: 'Weekly Contest 1', engagement: 5000 },
              { id: 2, type: 'HOT_PROBLEM', title: 'Two Sum', solves: 10000 },
            ],
            total: 2,
          }),
        });
      });

      expect(
        await page.locator('[data-testid="global-activity-section"]').isVisible(),
      ).toBeTruthy();
    });

    test('should show trending problems/contests', async ({ page }) => {
      await page.goto('/feed/global');

      expect(
        await page.locator('[data-testid="trending-section"]').isVisible(),
      ).toBeTruthy();
    });
  });

  test.describe('User Discovery & Search', () => {
    test('should search users', async ({ page }) => {
      await page.goto('/discover/users');

      await page.route('**/api/users/search*', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            data: [
              { id: 1, username: 'john123', rating: 2000, followerCount: 500 },
              { id: 2, username: 'john456', rating: 1800, followerCount: 300 },
            ],
            total: 2,
          }),
        });
      });

      const searchInput = page.locator('[data-testid="user-search-input"]');
      await searchInput.fill('john');

      expect(await page.locator('text=john123').isVisible()).toBeTruthy();
    });

    test('should filter users by skill level', async ({ page }) => {
      await page.goto('/discover/users');

      await page.route('**/api/users*', async (route) => {
        if (route.request().url().includes('minRating=2000')) {
          await route.fulfill({
            status: 200,
            body: JSON.stringify({
              data: [
                { id: 1, username: 'expert', rating: 2500 },
              ],
            }),
          });
        }
      });

      await page.locator('[data-testid="rating-filter"]').selectOption('2000');

      expect(await page.locator('text=expert').isVisible()).toBeTruthy();
    });

    test('should display user profile cards', async ({ page }) => {
      await page.goto('/discover/users');

      await page.route('**/api/users*', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            data: [
              {
                id: 1,
                username: 'user1',
                rating: 2000,
                problemsSolved: 300,
                followerCount: 150,
                recentAchievements: ['Master', 'Expert'],
              },
            ],
          }),
        });
      });

      expect(await page.locator('[data-testid="user-card"]').isVisible()).toBeTruthy();
      expect(await page.locator('text=300').isVisible()).toBeTruthy();
    });
  });

  test.describe('Follow Statistics', () => {
    test('should show follower growth chart', async ({ page }) => {
      await page.goto('/profile');

      await page.route('**/api/users/me/stats/followers', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            current: 500,
            data: [
              { date: '2024-01-01', count: 100 },
              { date: '2024-01-10', count: 250 },
              { date: '2024-01-15', count: 500 },
            ],
          }),
        });
      });

      expect(
        await page.locator('[data-testid="follower-growth-chart"]').isVisible(),
      ).toBeTruthy();
    });
  });
});
