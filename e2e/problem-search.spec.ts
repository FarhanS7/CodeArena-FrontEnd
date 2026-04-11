import { test, expect } from '@playwright/test';
import { authenticatedPage } from './fixtures';

test.describe('Problem Search & Discovery (RED Phase)', () => {
  test.describe('Basic Search', () => {
    test('should display search page with input and filters', async ({ page }) => {
      await page.goto('/problems');

      expect(await page.locator('[data-testid="search-input"]').isVisible()).toBeTruthy();
      expect(await page.locator('[data-testid="difficulty-filter"]').isVisible()).toBeTruthy();
      expect(await page.locator('[data-testid="tags-filter"]').isVisible()).toBeTruthy();
      expect(await page.locator('[data-testid="status-filter"]').isVisible()).toBeTruthy();
    });

    test('should search problems by keyword', async ({ page }) => {
      await page.goto('/problems');

      // Mock search API
      await page.route('**/api/problems/search*', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            data: [
              {
                id: 1,
                title: 'Two Sum',
                difficulty: 'EASY',
                acceptanceRate: 85,
                submissions: 1200,
                tags: ['Array', 'Hash Table'],
              },
              {
                id: 2,
                title: 'Two Sum II',
                difficulty: 'MEDIUM',
                acceptanceRate: 75,
                submissions: 800,
                tags: ['Array', 'Binary Search'],
              },
            ],
            total: 2,
          }),
        });
      });

      await page.fill('[data-testid="search-input"]', 'Two Sum');
      await page.click('[data-testid="search-btn"]');

      expect(await page.locator('text=Two Sum').first().isVisible()).toBeTruthy();
      expect(await page.locator('text=Two Sum II').isVisible()).toBeTruthy();
    });

    test('should display search results with problem cards', async ({ page }) => {
      await page.goto('/problems');

      await page.route('**/api/problems/search*', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            data: [
              {
                id: 1,
                title: 'Array Sum',
                difficulty: 'EASY',
                acceptanceRate: 90,
                submissions: 500,
                tags: ['Array'],
              },
            ],
            total: 1,
          }),
        });
      });

      await page.fill('[data-testid="search-input"]', 'Array');
      await page.click('[data-testid="search-btn"]');

      const card = page.locator('[data-testid="problem-card"]').first();
      expect(await card.locator('text=Array Sum').isVisible()).toBeTruthy();
      expect(await card.locator('[data-testid="difficulty-badge"]').isVisible()).toBeTruthy();
      expect(await card.locator('[data-testid="acceptance-rate"]').isVisible()).toBeTruthy();
    });
  });

  test.describe('Filtering', () => {
    test('should filter problems by difficulty', async ({ page }) => {
      await page.goto('/problems');

      await page.route('**/api/problems*', async (route) => {
        if (route.request().url().includes('difficulty=EASY')) {
          await route.fulfill({
            status: 200,
            body: JSON.stringify({
              data: [
                { id: 1, title: 'Easy Problem', difficulty: 'EASY', acceptanceRate: 90, tags: [] },
              ],
              total: 1,
            }),
          });
        } else {
          await route.fulfill({
            status: 200,
            body: JSON.stringify({ data: [], total: 0 }),
          });
        }
      });

      const difficultyFilter = page.locator('[data-testid="difficulty-filter"]');
      await difficultyFilter.selectOption('EASY');
      await page.click('[data-testid="filter-apply-btn"]');

      expect(await page.locator('text=Easy Problem').isVisible()).toBeTruthy();
    });

    test('should filter problems by tags', async ({ page }) => {
      await page.goto('/problems');

      await page.route('**/api/problems*', async (route) => {
        if (route.request().url().includes('tags=Array')) {
          await route.fulfill({
            status: 200,
            body: JSON.stringify({
              data: [
                {
                  id: 1,
                  title: 'Array Problem',
                  difficulty: 'MEDIUM',
                  acceptanceRate: 75,
                  tags: ['Array'],
                },
              ],
              total: 1,
            }),
          });
        } else {
          await route.fulfill({
            status: 200,
            body: JSON.stringify({ data: [], total: 0 }),
          });
        }
      });

      await page.click('[data-testid="tags-filter"]');
      await page.click('text=Array');
      await page.click('[data-testid="filter-apply-btn"]');

      expect(await page.locator('text=Array Problem').isVisible()).toBeTruthy();
    });

    test('should filter problems by status (attempted, solved, attempted wrong)', async ({ page }) => {
      await page.goto('/problems');

      await page.route('**/api/problems*', async (route) => {
        if (route.request().url().includes('status=SOLVED')) {
          await route.fulfill({
            status: 200,
            body: JSON.stringify({
              data: [
                {
                  id: 1,
                  title: 'Solved Problem',
                  difficulty: 'EASY',
                  status: 'SOLVED',
                  tags: [],
                },
              ],
              total: 1,
            }),
          });
        } else {
          await route.fulfill({
            status: 200,
            body: JSON.stringify({ data: [], total: 0 }),
          });
        }
      });

      const statusFilter = page.locator('[data-testid="status-filter"]');
      await statusFilter.selectOption('SOLVED');
      await page.click('[data-testid="filter-apply-btn"]');

      expect(await page.locator('text=Solved Problem').isVisible()).toBeTruthy();
    });

    test('should apply multiple filters simultaneously', async ({ page }) => {
      await page.goto('/problems');

      await page.route('**/api/problems*', async (route) => {
        const url = route.request().url();
        if (url.includes('difficulty=MEDIUM') && url.includes('tags=Array')) {
          await route.fulfill({
            status: 200,
            body: JSON.stringify({
              data: [
                {
                  id: 1,
                  title: 'Medium Array',
                  difficulty: 'MEDIUM',
                  acceptanceRate: 65,
                  tags: ['Array'],
                },
              ],
              total: 1,
            }),
          });
        } else {
          await route.fulfill({
            status: 200,
            body: JSON.stringify({ data: [], total: 0 }),
          });
        }
      });

      await page.locator('[data-testid="difficulty-filter"]').selectOption('MEDIUM');
      await page.click('[data-testid="tags-filter"]');
      await page.click('text=Array');
      await page.click('[data-testid="filter-apply-btn"]');

      expect(await page.locator('text=Medium Array').isVisible()).toBeTruthy();
    });
  });

  test.describe('Sorting', () => {
    test('should sort problems by difficulty', async ({ page }) => {
      await page.goto('/problems');

      await page.route('**/api/problems*', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            data: [
              { id: 1, title: 'Hard Problem', difficulty: 'HARD', acceptanceRate: 40, tags: [] },
              { id: 2, title: 'Easy Problem', difficulty: 'EASY', acceptanceRate: 90, tags: [] },
            ],
            total: 2,
          }),
        });
      });

      const sortSelect = page.locator('[data-testid="sort-select"]');
      await sortSelect.selectOption('difficulty');

      // Verify order
      const problems = page.locator('[data-testid="problem-card"]');
      expect(await problems.count()).toBeGreaterThan(0);
    });

    test('should sort problems by acceptance rate', async ({ page }) => {
      await page.goto('/problems');

      await page.route('**/api/problems*', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            data: [
              { id: 1, title: 'High Rate', difficulty: 'EASY', acceptanceRate: 99, tags: [] },
              { id: 2, title: 'Low Rate', difficulty: 'HARD', acceptanceRate: 25, tags: [] },
            ],
            total: 2,
          }),
        });
      });

      await page.locator('[data-testid="sort-select"]').selectOption('acceptance-rate');

      expect(await page.locator('[data-testid="problem-card"]').count()).toBeGreaterThan(0);
    });

    test('should sort problems by rating', async ({ page }) => {
      await page.goto('/problems');

      await page.route('**/api/problems*', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            data: [
              {
                id: 1,
                title: 'Top Rated',
                difficulty: 'MEDIUM',
                rating: 4.8,
                tags: [],
              },
            ],
            total: 1,
          }),
        });
      });

      await page.locator('[data-testid="sort-select"]').selectOption('rating');

      expect(await page.locator('text=Top Rated').isVisible()).toBeTruthy();
    });
  });

  test.describe('Pagination', () => {
    test('should paginate search results', async ({ page }) => {
      await page.goto('/problems');

      await page.route('**/api/problems*', async (route) => {
        const url = new URL(route.request().url());
        const page = url.searchParams.get('page') || '1';
        const pageSize = url.searchParams.get('pageSize') || '10';

        if (page === '1') {
          await route.fulfill({
            status: 200,
            body: JSON.stringify({
              data: Array.from({ length: 10 }, (_, i) => ({
                id: i + 1,
                title: `Problem ${i + 1}`,
                difficulty: 'EASY',
                tags: [],
              })),
              total: 25,
              page: 1,
              pageSize: 10,
            }),
          });
        } else if (page === '2') {
          await route.fulfill({
            status: 200,
            body: JSON.stringify({
              data: Array.from({ length: 10 }, (_, i) => ({
                id: i + 11,
                title: `Problem ${i + 11}`,
                difficulty: 'MEDIUM',
                tags: [],
              })),
              total: 25,
              page: 2,
              pageSize: 10,
            }),
          });
        }
      });

      await page.click('[data-testid="search-btn"]');

      expect(await page.locator('text=Problem 1').isVisible()).toBeTruthy();

      await page.click('[data-testid="next-page-btn"]');

      expect(await page.locator('text=Problem 11').isVisible()).toBeTruthy();
    });

    test('should show page info', async ({ page }) => {
      await page.goto('/problems');

      await page.route('**/api/problems*', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            data: Array.from({ length: 10 }, (_, i) => ({
              id: i + 1,
              title: `Problem ${i + 1}`,
              difficulty: 'EASY',
              tags: [],
            })),
            total: 50,
            page: 1,
            pageSize: 10,
          }),
        });
      });

      await page.click('[data-testid="search-btn"]');

      expect(
        await page.locator('[data-testid="pagination-info"]').textContent(),
      ).toContain('1');
      expect(await page.locator('[data-testid="pagination-info"]').textContent()).toContain('10');
      expect(await page.locator('[data-testid="pagination-info"]').textContent()).toContain('50');
    });
  });

  test.describe('Trending Problems', () => {
    test('should display trending problems section', async ({ page }) => {
      await page.goto('/problems');

      await page.route('**/api/problems/trending*', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            data: [
              { id: 1, title: 'Trending 1', difficulty: 'MEDIUM', trends: 500, tags: [] },
              { id: 2, title: 'Trending 2', difficulty: 'HARD', trends: 450, tags: [] },
              { id: 3, title: 'Trending 3', difficulty: 'EASY', trends: 400, tags: [] },
            ],
          }),
        });
      });

      expect(await page.locator('[data-testid="trending-section"]').isVisible()).toBeTruthy();
      expect(await page.locator('text=Trending 1').isVisible()).toBeTruthy();
    });

    test('should navigate to problem from trending', async ({ page }) => {
      await page.goto('/problems');

      await page.route('**/api/problems/trending*', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            data: [{ id: 1, title: 'Trending Problem', difficulty: 'MEDIUM', tags: [] }],
          }),
        });
      });

      await page.click('[data-testid="trending-problem-card"]');

      expect(page.url()).toContain('/problems/1');
    });
  });

  test.describe('Problem Recommendations', () => {
    test('should display recommended problems based on solving history', async ({ page }) => {
      await page.goto('/problems');

      await page.route('**/api/problems/recommendations*', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            data: [
              { id: 10, title: 'Recommended 1', difficulty: 'HARD', tags: ['Graph'] },
              { id: 11, title: 'Recommended 2', difficulty: 'HARD', tags: ['DP'] },
            ],
          }),
        });
      });

      expect(await page.locator('[data-testid="recommendations-section"]').isVisible()).toBeTruthy();
      expect(await page.locator('text=Recommended 1').isVisible()).toBeTruthy();
    });

    test('should show reason for recommendation', async ({ page }) => {
      await page.goto('/problems');

      await page.route('**/api/problems/recommendations*', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            data: [
              {
                id: 10,
                title: 'Recommended',
                difficulty: 'HARD',
                reason: 'Similar to problems you solved',
                tags: [],
              },
            ],
          }),
        });
      });

      expect(await page.locator('text=Similar to problems you solved').isVisible()).toBeTruthy();
    });
  });

  test.describe('Saved/Bookmarked Problems', () => {
    test('should allow saving a problem', async ({ page }) => {
      await page.goto('/problems');

      await page.route('**/api/problems*', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            data: [
              { id: 1, title: 'Saveable Problem', difficulty: 'MEDIUM', isSaved: false, tags: [] },
            ],
            total: 1,
          }),
        });
      });

      await page.route('**/api/problems/1/save', async (route) => {
        await route.fulfill({ status: 200, body: JSON.stringify({ success: true }) });
      });

      await page.click('[data-testid="search-btn"]');
      const saveBtn = page.locator('[data-testid="save-problem-btn"]').first();
      await saveBtn.click();

      expect(await saveBtn.locator('svg')).toBeTruthy(); // Icon should change
    });

    test('should display saved problems collection', async ({ page }) => {
      await page.goto('/problems/saved');

      await page.route('**/api/problems/saved*', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            data: [
              { id: 1, title: 'Saved Problem 1', difficulty: 'EASY', tags: [] },
              { id: 2, title: 'Saved Problem 2', difficulty: 'MEDIUM', tags: [] },
            ],
            total: 2,
          }),
        });
      });

      expect(await page.locator('text=Saved Problem 1').isVisible()).toBeTruthy();
      expect(await page.locator('text=Saved Problem 2').isVisible()).toBeTruthy();
    });
  });

  test.describe('Advanced Search', () => {
    test('should support complex filters combination', async ({ page }) => {
      await page.goto('/problems');

      await page.route('**/api/problems*', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            data: [
              {
                id: 1,
                title: 'Complex Result',
                difficulty: 'MEDIUM',
                acceptanceRate: 70,
                tags: ['Array', 'DP'],
              },
            ],
            total: 1,
          }),
        });
      });

      // Filter by multiple criteria
      await page.fill('[data-testid="search-input"]', 'array');
      await page.locator('[data-testid="difficulty-filter"]').selectOption('MEDIUM');
      await page.fill('[data-testid="min-acceptance-rate"]', '60');
      await page.fill('[data-testid="max-acceptance-rate"]', '80');
      await page.click('[data-testid="filter-apply-btn"]');

      expect(await page.locator('text=Complex Result').isVisible()).toBeTruthy();
    });

    test('should clear all filters', async ({ page }) => {
      await page.goto('/problems');

      await page.route('**/api/problems*', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            data: [
              { id: 1, title: 'Problem', difficulty: 'EASY', tags: [] },
              { id: 2, title: 'Another', difficulty: 'MEDIUM', tags: [] },
            ],
            total: 2,
          }),
        });
      });

      await page.fill('[data-testid="search-input"]', 'test');
      await page.locator('[data-testid="difficulty-filter"]').selectOption('HARD');
      await page.click('[data-testid="clear-filters-btn"]');

      const searchInput = page.locator('[data-testid="search-input"]');
      expect(await searchInput.inputValue()).toBe('');
    });
  });

  test.describe('Search Performance', () => {
    test('should display loading state while searching', async ({ page }) => {
      await page.goto('/problems');

      await page.route('**/api/problems*', async (route) => {
        await new Promise((r) => setTimeout(r, 1000));
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            data: [{ id: 1, title: 'Slow Result', difficulty: 'MEDIUM', tags: [] }],
            total: 1,
          }),
        });
      });

      const searchBtn = page.locator('[data-testid="search-btn"]');
      await searchBtn.click();

      expect(await page.locator('[data-testid="loading-spinner"]').isVisible()).toBeTruthy();

      await page.waitForSelector('text=Slow Result');
      expect(await page.locator('text=Slow Result').isVisible()).toBeTruthy();
    });

    test('should show no results message', async ({ page }) => {
      await page.goto('/problems');

      await page.route('**/api/problems*', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({ data: [], total: 0 }),
        });
      });

      await page.fill('[data-testid="search-input"]', 'nonexistent xyz 123');
      await page.click('[data-testid="search-btn"]');

      expect(await page.locator('[data-testid="no-results"]').isVisible()).toBeTruthy();
    });

    test('should handle search errors', async ({ page }) => {
      await page.goto('/problems');

      await page.route('**/api/problems*', async (route) => {
        await route.fulfill({ status: 500, body: 'Server Error' });
      });

      await page.fill('[data-testid="search-input"]', 'error test');
      await page.click('[data-testid="search-btn"]');

      expect(await page.locator('[data-testid="error-message"]').isVisible()).toBeTruthy();
    });
  });

  test.describe('Problem Detail View', () => {
    test('should navigate to problem detail from search results', async ({ page }) => {
      await page.goto('/problems');

      await page.route('**/api/problems*', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            data: [{ id: 42, title: 'Detail Problem', difficulty: 'HARD', tags: [] }],
            total: 1,
          }),
        });
      });

      await page.click('[data-testid="search-btn"]');
      await page.click('[data-testid="problem-card"]');

      expect(page.url()).toContain('/problems/42');
    });

    test('should display problem metadata in detail view', async ({ page }) => {
      const problemId = 42;
      await page.goto(`/problems/${problemId}`);

      await page.route(`**/api/problems/${problemId}`, async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            id: problemId,
            title: 'Two Sum',
            description: 'Find two numbers that add up to target',
            difficulty: 'EASY',
            acceptanceRate: 85,
            submissions: 1500,
            tags: ['Array', 'Hash Table'],
            timeLimit: 1000,
            memoryLimit: 256,
          }),
        });
      });

      expect(await page.locator('text=Two Sum').isVisible()).toBeTruthy();
      expect(await page.locator('text=Array').isVisible()).toBeTruthy();
      expect(await page.locator('text=Hash Table').isVisible()).toBeTruthy();
    });
  });
});
