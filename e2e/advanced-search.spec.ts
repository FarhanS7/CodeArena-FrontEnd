import { test, expect } from '@playwright/test';
import { authenticatedPage } from './fixtures';

test.describe('Advanced Search Features (RED Phase)', () => {
  test.describe('Saved/Bookmarked Problems', () => {
    test('should display saved problems collection', async ({ page }) => {
      await page.goto('/problems/saved');

      await page.route('**/api/problems/saved*', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            data: [
              {
                id: 1,
                title: 'Two Sum',
                difficulty: 'EASY',
                acceptanceRate: 85,
                isSaved: true,
                tags: [],
              },
              {
                id: 2,
                title: 'Merge Intervals',
                difficulty: 'MEDIUM',
                acceptanceRate: 70,
                isSaved: true,
                tags: [],
              },
            ],
            total: 2,
          }),
        });
      });

      expect(await page.locator('[data-testid="saved-problems-section"]').isVisible()).toBeTruthy();
      expect(await page.locator('text=Two Sum').isVisible()).toBeTruthy();
      expect(await page.locator('text=Merge Intervals').isVisible()).toBeTruthy();
    });

    test('should remove problem from saved collection', async ({ page }) => {
      await page.goto('/problems/saved');

      await page.route('**/api/problems/saved*', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            data: [{ id: 1, title: 'Two Sum', difficulty: 'EASY', isSaved: true, tags: [] }],
            total: 1,
          }),
        });
      });

      await page.route('**/api/problems/1/unsave', async (route) => {
        await route.fulfill({ status: 200, body: JSON.stringify({ success: true }) });
      });

      const removeBtn = page.locator('[data-testid="remove-saved-btn"]').first();
      await removeBtn.click();

      expect(await page.locator('[data-testid="save-success-toast"]').isVisible()).toBeTruthy();
    });

    test('should organize saved problems into collections/folders', async ({ page }) => {
      await page.goto('/problems/saved');

      await page.route('**/api/problems/collections*', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            data: [
              { id: 1, name: 'Array Problems', count: 5 },
              { id: 2, name: 'DP Problems', count: 3 },
            ],
          }),
        });
      });

      expect(await page.locator('[data-testid="collection-badge"]').first().isVisible()).toBeTruthy();
      expect(await page.locator('text=Array Problems').isVisible()).toBeTruthy();
      expect(await page.locator('text=DP Problems').isVisible()).toBeTruthy();
    });

    test('should export saved problems as CSV', async ({ page }) => {
      await page.goto('/problems/saved');

      await page.route('**/api/problems/saved*', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            data: [
              { id: 1, title: 'Problem 1', difficulty: 'EASY', tags: [] },
              { id: 2, title: 'Problem 2', difficulty: 'MEDIUM', tags: [] },
            ],
            total: 2,
          }),
        });
      });

      const exportBtn = page.locator('[data-testid="export-saved-btn"]');
      await exportBtn.click();

      expect(await page.locator('[data-testid="export-success"]').isVisible()).toBeTruthy();
    });
  });

  test.describe('Search History', () => {
    test('should display user search history', async ({ page }) => {
      await page.goto('/problems');

      await page.route('**/api/search/history*', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            data: [
              { id: 1, query: 'Two Sum', timestamp: '2024-01-15T10:00:00Z', count: 5 },
              { id: 2, query: 'Array', timestamp: '2024-01-14T15:30:00Z', count: 3 },
              { id: 3, query: 'Dynamic Programming', timestamp: '2024-01-13T09:00:00Z', count: 1 },
            ],
          }),
        });
      });

      await page.click('[data-testid="search-history-btn"]');

      expect(await page.locator('[data-testid="history-panel"]').isVisible()).toBeTruthy();
      expect(await page.locator('text=Two Sum').isVisible()).toBeTruthy();
      expect(await page.locator('text=Array').isVisible()).toBeTruthy();
    });

    test('should quickly search from history', async ({ page }) => {
      await page.goto('/problems');

      await page.route('**/api/search/history*', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            data: [{ query: 'Two Sum', timestamp: '2024-01-15T10:00:00Z', count: 5 }],
          }),
        });
      });

      await page.click('[data-testid="search-history-btn"]');
      await page.click('[data-testid="history-item-Two Sum"]');

      expect(await page.locator('[data-testid="search-input"]').inputValue()).toBe('Two Sum');
    });

    test('should clear search history', async ({ page }) => {
      await page.goto('/problems');

      await page.route('**/api/search/history*', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            data: [
              { query: 'Two Sum', timestamp: '2024-01-15T10:00:00Z' },
              { query: 'Array', timestamp: '2024-01-14T15:30:00Z' },
            ],
          }),
        });
      });

      await page.click('[data-testid="search-history-btn"]');
      await page.click('[data-testid="clear-history-btn"]');

      expect(await page.locator('[data-testid="history-empty"]').isVisible()).toBeTruthy();
    });

    test('should delete individual history items', async ({ page }) => {
      await page.goto('/problems');

      await page.route('**/api/search/history*', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            data: [
              { id: 1, query: 'Two Sum', timestamp: '2024-01-15T10:00:00Z' },
              { id: 2, query: 'Array', timestamp: '2024-01-14T15:30:00Z' },
            ],
          }),
        });
      });

      await page.click('[data-testid="search-history-btn"]');
      await page.click('[data-testid="delete-history-item-1"]');

      expect(await page.locator('text=Two Sum').isVisible()).toBeFalsy();
      expect(await page.locator('text=Array').isVisible()).toBeTruthy();
    });
  });

  test.describe('Autocomplete Suggestions', () => {
    test('should show autocomplete suggestions while typing', async ({ page }) => {
      await page.goto('/problems');

      await page.route('**/api/problems/autocomplete*', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            data: [
              { title: 'Two Sum', id: 1 },
              { title: 'Two Sum II', id: 2 },
              { title: 'Two Sum III', id: 3 },
            ],
          }),
        });
      });

      const searchInput = page.locator('[data-testid="search-input"]');
      await searchInput.fill('Two');

      expect(await page.locator('[data-testid="autocomplete-suggestions"]').isVisible()).toBeTruthy();
      expect(await page.locator('text=Two Sum II').isVisible()).toBeTruthy();
    });

    test('should filter suggestions as user types', async ({ page }) => {
      await page.goto('/problems');

      await page.route('**/api/problems/autocomplete*', async (route) => {
        const query = new URL(route.request().url()).searchParams.get('q');
        if (query === 'arr') {
          await route.fulfill({
            status: 200,
            body: JSON.stringify({
              data: [
                { title: 'Array Sum', id: 1 },
                { title: 'Array Partition', id: 2 },
              ],
            }),
          });
        } else {
          await route.fulfill({
            status: 200,
            body: JSON.stringify({ data: [] }),
          });
        }
      });

      const searchInput = page.locator('[data-testid="search-input"]');
      await searchInput.fill('arr');

      expect(await page.locator('text=Array Sum').isVisible()).toBeTruthy();
    });

    test('should navigate suggestions with keyboard', async ({ page }) => {
      await page.goto('/problems');

      await page.route('**/api/problems/autocomplete*', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            data: [
              { title: 'Problem A', id: 1 },
              { title: 'Problem B', id: 2 },
            ],
          }),
        });
      });

      const searchInput = page.locator('[data-testid="search-input"]');
      await searchInput.fill('Problem');
      await searchInput.press('ArrowDown');
      await searchInput.press('ArrowDown');
      await searchInput.press('Enter');

      expect(await searchInput.inputValue()).toBe('Problem B');
    });

    test('should search from autocomplete selection', async ({ page }) => {
      await page.goto('/problems');

      await page.route('**/api/problems/autocomplete*', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            data: [{ title: 'Selected Problem', id: 1 }],
          }),
        });
      });

      const searchInput = page.locator('[data-testid="search-input"]');
      await searchInput.fill('Selected');

      const suggestion = page.locator('[data-testid="suggestion-Selected Problem"]');
      await suggestion.click();

      expect(await searchInput.inputValue()).toBe('Selected Problem');
    });
  });

  test.describe('Recent Searches', () => {
    test('should display recent searches dropdown', async ({ page }) => {
      await page.goto('/problems');

      await page.route('**/api/search/recent*', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            data: [
              { query: 'Two Sum', timestamp: '2024-01-15T10:00:00Z' },
              { query: 'Array Problems', timestamp: '2024-01-14T15:30:00Z' },
            ],
          }),
        });
      });

      const searchInput = page.locator('[data-testid="search-input"]');
      await searchInput.click();

      expect(await page.locator('[data-testid="recent-searches-list"]').isVisible()).toBeTruthy();
      expect(await page.locator('text=Two Sum').isVisible()).toBeTruthy();
    });

    test('should click recent search to populate input', async ({ page }) => {
      await page.goto('/problems');

      await page.route('**/api/search/recent*', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            data: [{ query: 'Recent Query', timestamp: '2024-01-15T10:00:00Z' }],
          }),
        });
      });

      const searchInput = page.locator('[data-testid="search-input"]');
      await searchInput.click();
      await page.click('[data-testid="recent-search-Recent Query"]');

      expect(await searchInput.inputValue()).toBe('Recent Query');
    });
  });

  test.describe('Saved Filters/Search Presets', () => {
    test('should save current filter combination', async ({ page }) => {
      await page.goto('/problems');

      // Set filters
      await page.locator('[data-testid="difficulty-filter"]').selectOption('MEDIUM');
      await page.click('[data-testid="tags-filter"]');
      await page.click('text=Array');

      // Save preset
      await page.click('[data-testid="save-preset-btn"]');
      await page.fill('[data-testid="preset-name-input"]', 'Medium Array Problems');
      await page.click('[data-testid="confirm-save-preset"]');

      expect(
        await page.locator('[data-testid="preset-saved-toast"]').isVisible(),
      ).toBeTruthy();
    });

    test('should load saved filter preset', async ({ page }) => {
      await page.goto('/problems');

      await page.route('**/api/search/presets*', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            data: [
              {
                id: 1,
                name: 'Easy Array',
                filters: { difficulty: 'EASY', tags: ['Array'] },
              },
            ],
          }),
        });
      });

      await page.click('[data-testid="load-preset-btn"]');
      await page.click('[data-testid="preset-Easy Array"]');

      expect(await page.locator('[data-testid="difficulty-filter"]').inputValue()).toBe('EASY');
    });

    test('should delete saved preset', async ({ page }) => {
      await page.goto('/problems');

      await page.route('**/api/search/presets*', async (route) => {
        if (route.request().method() === 'DELETE') {
          await route.fulfill({ status: 200, body: JSON.stringify({ success: true }) });
        } else {
          await route.fulfill({
            status: 200,
            body: JSON.stringify({
              data: [{ id: 1, name: 'Easy Array', filters: {} }],
            }),
          });
        }
      });

      await page.click('[data-testid="load-preset-btn"]');
      await page.click('[data-testid="delete-preset-1"]');

      expect(await page.locator('[data-testid="preset-deleted-toast"]').isVisible()).toBeTruthy();
    });
  });

  test.describe('Advanced Filter Combinations', () => {
    test('should combine multiple advanced filters', async ({ page }) => {
      await page.goto('/problems');

      await page.route('**/api/problems/search*', async (route) => {
        const url = route.request().url();
        if (
          url.includes('difficulty=HARD') &&
          url.includes('minTime=2000') &&
          url.includes('maxMemory=512')
        ) {
          await route.fulfill({
            status: 200,
            body: JSON.stringify({
              data: [
                {
                  id: 1,
                  title: 'Complex Problem',
                  difficulty: 'HARD',
                  tags: [],
                },
              ],
              total: 1,
            }),
          });
        }
      });

      // Apply filters
      await page.locator('[data-testid="difficulty-filter"]').selectOption('HARD');
      await page.fill('[data-testid="min-time-limit"]', '2000');
      await page.fill('[data-testid="max-memory-limit"]', '512');
      await page.click('[data-testid="filter-apply-btn"]');

      expect(await page.locator('text=Complex Problem').isVisible()).toBeTruthy();
    });

    test('should filter by acceptance rate range', async ({ page }) => {
      await page.goto('/problems');

      await page.fill('[data-testid="min-acceptance-rate"]', '40');
      await page.fill('[data-testid="max-acceptance-rate"]', '60');
      await page.click('[data-testid="filter-apply-btn"]');

      expect(await page.locator('[data-testid="problem-card"]').first().isVisible()).toBeTruthy();
    });

    test('should filter by multiple tags', async ({ page }) => {
      await page.goto('/problems');

      await page.click('[data-testid="tags-filter"]');
      await page.click('text=Array');
      await page.click('text=Dynamic Programming');

      await page.click('[data-testid="filter-apply-btn"]');

      expect(await page.locator('[data-testid="problem-card"]').first().isVisible()).toBeTruthy();
    });

    test('should show applied filters summary', async ({ page }) => {
      await page.goto('/problems');

      // Apply multiple filters
      await page.locator('[data-testid="difficulty-filter"]').selectOption('MEDIUM');
      await page.fill('[data-testid="min-acceptance-rate"]', '50');

      await page.click('[data-testid="filter-apply-btn"]');

      const filterSummary = page.locator('[data-testid="active-filters-summary"]');
      expect(await filterSummary.textContent()).toContain('Difficulty');
      expect(await filterSummary.textContent()).toContain('Acceptance');
    });
  });

  test.describe('Search Analytics & Stats', () => {
    test('should show search statistics', async ({ page }) => {
      await page.goto('/problems');

      await page.route('**/api/search/stats*', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            totalSearches: 150,
            averageSearchTime: 2.5,
            mostSearched: 'Two Sum',
            trendingSearches: ['Two Sum', 'Array', 'DP'],
          }),
        });
      });

      await page.click('[data-testid="search-stats-btn"]');

      expect(await page.locator('[data-testid="stats-panel"]').isVisible()).toBeTruthy();
      expect(await page.locator('text=150').isVisible()).toBeTruthy();
      expect(await page.locator('text=Two Sum').isVisible()).toBeTruthy();
    });

    test('should display trending searches', async ({ page }) => {
      await page.goto('/problems');

      await page.route('**/api/search/trending*', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            data: [
              { query: 'Two Sum', searches: 500, trend: 'up' },
              { query: 'Array Problems', searches: 400, trend: 'stable' },
              { query: 'Tree Traversal', searches: 300, trend: 'down' },
            ],
          }),
        });
      });

      expect(
        await page.locator('[data-testid="trending-searches-section"]').isVisible(),
      ).toBeTruthy();
      expect(await page.locator('text=Two Sum').isVisible()).toBeTruthy();
    });
  });

  test.describe('Search Shortcuts & Tips', () => {
    test('should display search tips/help', async ({ page }) => {
      await page.goto('/problems');

      await page.click('[data-testid="search-help-btn"]');

      expect(await page.locator('[data-testid="search-tips-modal"]').isVisible()).toBeTruthy();
      expect(await page.locator('text=Search Tips').isVisible()).toBeTruthy();
      expect(await page.locator('text=difficulty:').isVisible()).toBeTruthy();
    });

    test('should support search operators', async ({ page }) => {
      await page.goto('/problems');

      await page.route('**/api/problems/search*', async (route) => {
        if (route.request().url().includes('query=difficulty%3AEasy')) {
          await route.fulfill({
            status: 200,
            body: JSON.stringify({
              data: [{ id: 1, title: 'Easy Problem', difficulty: 'EASY', tags: [] }],
              total: 1,
            }),
          });
        }
      });

      const searchInput = page.locator('[data-testid="search-input"]');
      await searchInput.fill('difficulty:Easy');
      await page.click('[data-testid="search-btn"]');

      expect(await page.locator('text=Easy Problem').isVisible()).toBeTruthy();
    });
  });
});
