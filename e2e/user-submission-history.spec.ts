import { test, expect, Page } from '@playwright/test';

/**
 * TDD RED Phase - User Submission History Tracking
 * Comprehensive tests for submission filtering, sorting, analytics, and performance
 */

test.describe('User Submission History Tracking (RED Phase)', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();

    // Mock localStorage for authentication
    await page.context().addInitScript(() => {
      localStorage.setItem('auth_token', 'test-token-123');
      localStorage.setItem('user_id', 'user-1');
      localStorage.setItem('username', 'testuser');
    });
  });

  test.afterEach(async () => {
    await page.close();
  });

  test.describe('Submission List Filtering', () => {
    /**
     * TEST 1: Display all submissions with pagination
     */
    test('should display all submissions with pagination controls', async () => {
      // Mock submission history endpoint with pagination
      await page.route('**/api/users/profile/submissions*', async (route) => {
        const url = new URL(route.request().url());
        const page = parseInt(url.searchParams.get('page') || '1');

        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            submissions: Array.from({ length: 10 }, (_, i) => ({
              id: `sub-${page}-${i}`,
              problemId: 100 + i,
              problemTitle: `Problem ${100 + i}`,
              status: i % 3 === 0 ? 'ACCEPTED' : i % 3 === 1 ? 'WRONG_ANSWER' : 'TIME_LIMIT_EXCEEDED',
              language: ['python', 'cpp', 'java'][i % 3],
              submittedAt: new Date(Date.now() - i * 86400000).toISOString(),
              score: i % 3 === 0 ? 100 : 0,
              verdict: {
                status: i % 3 === 0 ? 'ACCEPTED' : 'REJECTED',
                runtime: Math.random() * 5000,
                memory: Math.random() * 256,
              },
            })),
            total: 150,
            page,
            pageSize: 10,
            totalPages: 15,
          }),
        });
      });

      await page.goto('/profile?tab=submissions');

      // Verify submission table is visible
      const submissionTable = page.locator('[data-testid="submission-list"]');
      await expect(submissionTable).toBeVisible();

      // Verify pagination controls
      const pagination = page.locator('[data-testid="submission-pagination"]');
      await expect(pagination).toBeVisible();

      // Verify page info
      await expect(page.locator('[data-testid="pagination-info"]')).toContainText('1 - 10 of 150');
    });

    /**
     * TEST 2: Filter submissions by status
     */
    test('should filter submissions by status', async () => {
      await page.route('**/api/users/profile/submissions*', async (route) => {
        const url = new URL(route.request().url());
        const status = url.searchParams.get('status');

        const statusMap: { [key: string]: any[] } = {
          ACCEPTED: Array.from({ length: 5 }, (_, i) => ({
            id: `sub-accepted-${i}`,
            problemId: 100 + i,
            problemTitle: `Problem ${100 + i}`,
            status: 'ACCEPTED',
            language: 'python',
            submittedAt: new Date().toISOString(),
            score: 100,
          })),
          WRONG_ANSWER: Array.from({ length: 3 }, (_, i) => ({
            id: `sub-wa-${i}`,
            problemId: 200 + i,
            problemTitle: `Problem ${200 + i}`,
            status: 'WRONG_ANSWER',
            language: 'cpp',
            submittedAt: new Date().toISOString(),
            score: 0,
          })),
          ALL: Array.from({ length: 8 }, (_, i) => ({
            id: `sub-all-${i}`,
            problemId: 100 + i,
            problemTitle: `Problem ${100 + i}`,
            status: i < 5 ? 'ACCEPTED' : 'WRONG_ANSWER',
            language: 'python',
            submittedAt: new Date().toISOString(),
            score: i < 5 ? 100 : 0,
          })),
        };

        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            submissions: statusMap[status || 'ALL'],
            total: statusMap[status || 'ALL'].length,
          }),
        });
      });

      await page.goto('/profile?tab=submissions');

      // Open status filter dropdown
      const statusFilter = page.locator('[data-testid="status-filter"]');
      await statusFilter.click();

      // Select ACCEPTED status
      const acceptedOption = page.locator('[data-testid="filter-option-ACCEPTED"]');
      await acceptedOption.click();

      // Verify only ACCEPTED submissions are shown
      await expect(page.locator('[data-testid="submission-status-badge"]')).toContainText('ACCEPTED');

      // Verify count matches
      const submissionRows = page.locator('[data-testid="submission-row"]');
      await expect(submissionRows).toHaveCount(5);
    });

    /**
     * TEST 3: Search submissions by problem title
     */
    test('should search submissions by problem title', async () => {
      await page.route('**/api/users/profile/submissions*', async (route) => {
        const url = new URL(route.request().url());
        const query = url.searchParams.get('search') || '';

        const allSubmissions = [
          { id: 'sub-1', problemId: 101, problemTitle: 'Two Sum', status: 'ACCEPTED', language: 'python', submittedAt: new Date().toISOString(), score: 100 },
          { id: 'sub-2', problemId: 102, problemTitle: 'Reverse String', status: 'ACCEPTED', language: 'cpp', submittedAt: new Date().toISOString(), score: 100 },
          { id: 'sub-3', problemId: 103, problemTitle: 'Palindrome Check', status: 'WRONG_ANSWER', language: 'java', submittedAt: new Date().toISOString(), score: 0 },
        ];

        const filtered = query ? allSubmissions.filter((s) => s.problemTitle.toLowerCase().includes(query.toLowerCase())) : allSubmissions;

        await route.fulfill({
          status: 200,
          body: JSON.stringify({ submissions: filtered, total: filtered.length }),
        });
      });

      await page.goto('/profile?tab=submissions');

      // Find search input
      const searchInput = page.locator('[data-testid="submission-search"]');
      await searchInput.fill('Two Sum');

      // Wait for results
      await page.waitForTimeout(500);

      // Verify only matching submission is shown
      const submissionRows = page.locator('[data-testid="submission-row"]');
      await expect(submissionRows).toHaveCount(1);
      await expect(submissionRows).toContainText('Two Sum');
    });

    /**
     * TEST 4: Filter by date range
     */
    test('should filter submissions by date range', async () => {
      await page.route('**/api/users/profile/submissions*', async (route) => {
        const url = new URL(route.request().url());
        const startDate = url.searchParams.get('startDate');
        const endDate = url.searchParams.get('endDate');

        const submissions = Array.from({ length: 5 }, (_, i) => ({
          id: `sub-${i}`,
          problemId: 100 + i,
          problemTitle: `Problem ${100 + i}`,
          status: 'ACCEPTED',
          language: 'python',
          submittedAt: new Date(Date.now() - i * 86400000).toISOString(),
          score: 100,
        }));

        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            submissions: startDate && endDate ? submissions.slice(0, 3) : submissions,
            total: startDate && endDate ? 3 : 5,
          }),
        });
      });

      await page.goto('/profile?tab=submissions');

      // Open date filter
      const dateFilter = page.locator('[data-testid="date-filter"]');
      await dateFilter.click();

      // Set date range
      const startDateInput = page.locator('[data-testid="date-start"]');
      const endDateInput = page.locator('[data-testid="date-end"]');

      const today = new Date();
      const sevenDaysAgo = new Date(today.getTime() - 7 * 86400000);

      await startDateInput.fill(sevenDaysAgo.toISOString().split('T')[0]);
      await endDateInput.fill(today.toISOString().split('T')[0]);

      // Click apply
      await page.locator('[data-testid="date-filter-apply"]').click();

      // Verify filtered results
      const submissionRows = page.locator('[data-testid="submission-row"]');
      await expect(submissionRows).toHaveCount(3);
    });
  });

  test.describe('Submission Sorting', () => {
    /**
     * TEST 5: Sort submissions by date
     */
    test('should sort submissions by date', async () => {
      await page.route('**/api/users/profile/submissions*', async (route) => {
        const url = new URL(route.request().url());
        const sortBy = url.searchParams.get('sortBy') || 'date';
        const order = url.searchParams.get('order') || 'desc';

        const submissions = [
          { id: 'sub-1', problemId: 101, problemTitle: 'Problem A', status: 'ACCEPTED', submittedAt: '2024-01-05T10:00:00Z', score: 100 },
          { id: 'sub-2', problemId: 102, problemTitle: 'Problem B', status: 'ACCEPTED', submittedAt: '2024-01-03T10:00:00Z', score: 100 },
          { id: 'sub-3', problemId: 103, problemTitle: 'Problem C', status: 'ACCEPTED', submittedAt: '2024-01-04T10:00:00Z', score: 100 },
        ];

        if (sortBy === 'date') {
          submissions.sort((a, b) => {
            const dateA = new Date(a.submittedAt).getTime();
            const dateB = new Date(b.submittedAt).getTime();
            return order === 'desc' ? dateB - dateA : dateA - dateB;
          });
        }

        await route.fulfill({
          status: 200,
          body: JSON.stringify({ submissions, total: submissions.length }),
        });
      });

      await page.goto('/profile?tab=submissions');

      // Click date sort column
      const dateHeader = page.locator('[data-testid="sort-by-date"]');
      await dateHeader.click();

      // Verify sort order (most recent first)
      const submissionRows = page.locator('[data-testid="submission-row"]');
      const firstRow = submissionRows.first();
      await expect(firstRow).toContainText('Problem A'); // Most recent
    });

    /**
     * TEST 6: Sort submissions by score
     */
    test('should sort submissions by score', async () => {
      await page.route('**/api/users/profile/submissions*', async (route) => {
        const url = new URL(route.request().url());
        const sortBy = url.searchParams.get('sortBy');

        let submissions = [
          { id: 'sub-1', problemId: 101, problemTitle: 'Problem A', status: 'ACCEPTED', score: 100, submittedAt: new Date().toISOString() },
          { id: 'sub-2', problemId: 102, problemTitle: 'Problem B', status: 'PARTIAL', score: 50, submittedAt: new Date().toISOString() },
          { id: 'sub-3', problemId: 103, problemTitle: 'Problem C', status: 'WRONG_ANSWER', score: 0, submittedAt: new Date().toISOString() },
        ];

        if (sortBy === 'score') {
          submissions.sort((a, b) => b.score - a.score);
        }

        await route.fulfill({
          status: 200,
          body: JSON.stringify({ submissions, total: submissions.length }),
        });
      });

      await page.goto('/profile?tab=submissions');

      // Click score sort
      const scoreHeader = page.locator('[data-testid="sort-by-score"]');
      await scoreHeader.click();

      // Verify ordering
      const submissionRows = page.locator('[data-testid="submission-row"]');
      await expect(submissionRows.nth(0)).toContainText('100');
      await expect(submissionRows.nth(1)).toContainText('50');
    });

    /**
     * TEST 7: Sort submissions by language
     */
    test('should sort submissions by language', async () => {
      await page.route('**/api/users/profile/submissions*', async (route) => {
        const url = new URL(route.request().url());
        const sortBy = url.searchParams.get('sortBy');

        let submissions = [
          { id: 'sub-1', problemId: 101, problemTitle: 'Problem A', language: 'python', score: 100, submittedAt: new Date().toISOString() },
          { id: 'sub-2', problemId: 102, problemTitle: 'Problem B', language: 'cpp', score: 100, submittedAt: new Date().toISOString() },
          { id: 'sub-3', problemId: 103, problemTitle: 'Problem C', language: 'java', score: 100, submittedAt: new Date().toISOString() },
        ];

        if (sortBy === 'language') {
          submissions.sort((a, b) => a.language.localeCompare(b.language));
        }

        await route.fulfill({
          status: 200,
          body: JSON.stringify({ submissions, total: submissions.length }),
        });
      });

      await page.goto('/profile?tab=submissions');

      const languageHeader = page.locator('[data-testid="sort-by-language"]');
      await languageHeader.click();

      const submissionRows = page.locator('[data-testid="submission-row"]');
      await expect(submissionRows.nth(0)).toContainText('cpp'); // Alphabetical order
    });
  });

  test.describe('Submission Analytics', () => {
    /**
     * TEST 8: Display submission statistics
     */
    test('should display submission statistics summary', async () => {
      await page.route('**/api/users/profile/submissions/stats*', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            stats: {
              totalSubmissions: 156,
              acceptedSubmissions: 78,
              rejectedSubmissions: 78,
              acceptanceRate: 0.5,
              averageScore: 50,
              languageBreakdown: {
                python: 80,
                cpp: 45,
                java: 31,
              },
              successRatio: 0.5,
              totalTime: 156 * 300, // Total seconds solving
              averageTimePerProblem: 300,
            },
          }),
        });
      });

      await page.route('**/api/users/profile/submissions*', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            submissions: Array.from({ length: 10 }, (_, i) => ({
              id: `sub-${i}`,
              problemId: 100 + i,
              problemTitle: `Problem ${100 + i}`,
              status: i % 2 === 0 ? 'ACCEPTED' : 'WRONG_ANSWER',
              language: 'python',
              submittedAt: new Date().toISOString(),
              score: i % 2 === 0 ? 100 : 0,
            })),
            total: 156,
          }),
        });
      });

      await page.goto('/profile?tab=submissions');

      // Verify stats cards
      await expect(page.locator('[data-testid="stat-total-submissions"]')).toContainText('156');
      await expect(page.locator('[data-testid="stat-accepted"]')).toContainText('78');
      await expect(page.locator('[data-testid="stat-acceptance-rate"]')).toContainText('50%');
      await expect(page.locator('[data-testid="stat-avg-score"]')).toContainText('50');
    });

    /**
     * TEST 9: Show language distribution chart
     */
    test('should show language distribution in chart', async () => {
      await page.route('**/api/users/profile/submissions/stats*', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            stats: {
              languageBreakdown: {
                python: 80,
                cpp: 45,
                java: 31,
              },
            },
          }),
        });
      });

      await page.route('**/api/users/profile/submissions*', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            submissions: [],
            total: 0,
          }),
        });
      });

      await page.goto('/profile?tab=submissions');

      // Verify language chart
      const languageChart = page.locator('[data-testid="language-distribution-chart"]');
      await expect(languageChart).toBeVisible();

      // Verify language labels
      await expect(page.locator('[data-testid="chart-label-python"]')).toContainText('Python');
      await expect(page.locator('[data-testid="chart-label-cpp"]')).toContainText('C++');
      await expect(page.locator('[data-testid="chart-label-java"]')).toContainText('Java');
    });

    /**
     * TEST 10: Display submission timeline
     */
    test('should display submission timeline visualization', async () => {
      await page.route('**/api/users/profile/submissions/timeline*', async (route) => {
        const today = new Date();
        const timeline = Array.from({ length: 7 }, (_, i) => ({
          date: new Date(today.getTime() - (6 - i) * 86400000).toISOString().split('T')[0],
          submissions: Math.floor(Math.random() * 10) + 1,
          accepted: Math.floor(Math.random() * 5) + 1,
        }));

        await route.fulfill({
          status: 200,
          body: JSON.stringify({ timeline }),
        });
      });

      await page.route('**/api/users/profile/submissions*', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({ submissions: [], total: 0 }),
        });
      });

      await page.goto('/profile?tab=submissions');

      // Verify timeline is visible
      const timeline = page.locator('[data-testid="submission-timeline"]');
      await expect(timeline).toBeVisible();

      // Verify day bars
      const dayBars = page.locator('[data-testid="timeline-day-bar"]');
      await expect(dayBars).toHaveCount(7);
    });
  });

  test.describe('Performance & Difficulty Tracking', () => {
    /**
     * TEST 11: Show submission difficulty badge
     */
    test('should display problem difficulty for each submission', async () => {
      await page.route('**/api/users/profile/submissions*', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            submissions: [
              { id: 'sub-1', problemId: 101, problemTitle: 'Two Sum', difficulty: 'EASY', status: 'ACCEPTED', submittedAt: new Date().toISOString(), score: 100 },
              { id: 'sub-2', problemId: 102, problemTitle: 'Merge Intervals', difficulty: 'MEDIUM', status: 'ACCEPTED', submittedAt: new Date().toISOString(), score: 100 },
              { id: 'sub-3', problemId: 103, problemTitle: 'Wildcard Matching', difficulty: 'HARD', status: 'WRONG_ANSWER', submittedAt: new Date().toISOString(), score: 0 },
            ],
            total: 3,
          }),
        });
      });

      await page.goto('/profile?tab=submissions');

      // Verify difficulty badges
      await expect(page.locator('[data-testid="difficulty-badge-EASY"]')).toBeVisible();
      await expect(page.locator('[data-testid="difficulty-badge-MEDIUM"]')).toBeVisible();
      await expect(page.locator('[data-testid="difficulty-badge-HARD"]')).toBeVisible();

      // Verify difficulty colors
      const easyBadge = page.locator('[data-testid="difficulty-badge-EASY"]');
      await expect(easyBadge).toHaveAttribute('class', /.*green.*/);
    });

    /**
     * TEST 12: Show runtime and memory stats
     */
    test('should display runtime and memory usage for submissions', async () => {
      await page.route('**/api/users/profile/submissions*', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            submissions: [
              {
                id: 'sub-1',
                problemId: 101,
                problemTitle: 'Problem A',
                status: 'ACCEPTED',
                submittedAt: new Date().toISOString(),
                verdict: { runtime: 125, memory: 32.5, runtimePercent: 45, memoryPercent: 52 },
              },
              {
                id: 'sub-2',
                problemId: 102,
                problemTitle: 'Problem B',
                status: 'TIME_LIMIT_EXCEEDED',
                submittedAt: new Date().toISOString(),
                verdict: { runtime: 5000, memory: 256, runtimePercent: 100, memoryPercent: 100 },
              },
            ],
            total: 2,
          }),
        });
      });

      await page.goto('/profile?tab=submissions');

      // Verify runtime display
      await expect(page.locator('[data-testid="runtime-ms"]').first()).toContainText('125ms');

      // Verify memory display
      await expect(page.locator('[data-testid="memory-mb"]').first()).toContainText('32.5MB');

      // Verify runtime percentile
      await expect(page.locator('[data-testid="runtime-percentile"]').first()).toContainText('45%');
    });
  });

  test.describe('Submission Details & Retry', () => {
    /**
     * TEST 13: View detailed submission verdict
     */
    test('should show detailed verdict for a submission', async () => {
      await page.route('**/api/users/profile/submissions*', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            submissions: [
              {
                id: 'sub-1',
                problemId: 101,
                problemTitle: 'Two Sum',
                status: 'WRONG_ANSWER',
                submittedAt: new Date().toISOString(),
              },
            ],
            total: 1,
          }),
        });
      });

      await page.route('**/api/submissions/sub-1*', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            submission: {
              id: 'sub-1',
              code: 'def twoSum(nums, target): return [0, 1]',
              language: 'python',
              status: 'WRONG_ANSWER',
              testResults: [
                { testCase: 1, expected: '[0, 1]', actual: '[0, 1]', status: 'PASS', stderr: '' },
                { testCase: 2, expected: '[1, 2]', actual: '[0, 1]', status: 'FAIL', stderr: 'Wrong answer' },
              ],
            },
          }),
        });
      });

      await page.goto('/profile?tab=submissions');

      // Click submission row
      const submissionRow = page.locator('[data-testid="submission-row"]');
      await submissionRow.click();

      // Verify details modal
      const detailsModal = page.locator('[data-testid="submission-details-modal"]');
      await expect(detailsModal).toBeVisible();

      // Verify test results
      await expect(page.locator('[data-testid="test-result-1"]')).toContainText('PASS');
      await expect(page.locator('[data-testid="test-result-2"]')).toContainText('FAIL');
    });

    /**
     * TEST 14: Retry submission
     */
    test('should allow retrying a submission', async () => {
      await page.route('**/api/users/profile/submissions*', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            submissions: [
              {
                id: 'sub-1',
                problemId: 101,
                problemTitle: 'Two Sum',
                status: 'WRONG_ANSWER',
                submittedAt: new Date().toISOString(),
              },
            ],
            total: 1,
          }),
        });
      });

      await page.route('**/api/submissions/sub-1*', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            submission: {
              id: 'sub-1',
              code: 'def twoSum(nums, target): return [0, 1]',
              language: 'python',
            },
          }),
        });
      });

      await page.route('**/api/problems/101/submit*', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            submissionId: 'sub-2',
            status: 'ACCEPTED',
          }),
        });
      });

      await page.goto('/profile?tab=submissions');

      // Click submission row
      const submissionRow = page.locator('[data-testid="submission-row"]');
      await submissionRow.click();

      // Click retry button
      const retryButton = page.locator('[data-testid="retry-submission-btn"]');
      await retryButton.click();

      // Verify redirected to problem editor
      await expect(page).toHaveURL(/\/problems\/101/);
    });
  });

  test.describe('Submission Comparison', () => {
    /**
     * TEST 15: Compare two submissions for same problem
     */
    test('should allow comparing submissions for the same problem', async () => {
      await page.route('**/api/users/profile/submissions*', async (route) => {
        const url = new URL(route.request().url());
        const problemId = url.searchParams.get('problemId');

        if (problemId === '101') {
          await route.fulfill({
            status: 200,
            body: JSON.stringify({
              submissions: [
                { id: 'sub-1', problemId: 101, problemTitle: 'Two Sum', status: 'WRONG_ANSWER', submittedAt: new Date(Date.now() - 86400000).toISOString(), code: 'v1' },
                { id: 'sub-2', problemId: 101, problemTitle: 'Two Sum', status: 'ACCEPTED', submittedAt: new Date().toISOString(), code: 'v2' },
              ],
              total: 2,
            }),
          });
        } else {
          await route.fulfill({
            status: 200,
            body: JSON.stringify({
              submissions: [],
              total: 0,
            }),
          });
        }
      });

      await page.goto('/profile?tab=submissions&problemId=101');

      // Verify multiple submissions shown
      const submissionRows = page.locator('[data-testid="submission-row"]');
      await expect(submissionRows).toHaveCount(2);

      // Select first submission
      const checkbox1 = page.locator('[data-testid="select-submission-sub-1"]');
      await checkbox1.click();

      // Select second submission
      const checkbox2 = page.locator('[data-testid="select-submission-sub-2"]');
      await checkbox2.click();

      // Click compare button
      const compareButton = page.locator('[data-testid="compare-submissions-btn"]');
      await compareButton.click();

      // Verify comparison view
      const comparisonView = page.locator('[data-testid="submission-comparison-view"]');
      await expect(comparisonView).toBeVisible();
    });
  });

  test.describe('Export & Analytics', () => {
    /**
     * TEST 16: Export submission history to CSV
     */
    test('should export submission history to CSV', async () => {
      await page.route('**/api/users/profile/submissions*', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            submissions: Array.from({ length: 5 }, (_, i) => ({
              id: `sub-${i}`,
              problemId: 100 + i,
              problemTitle: `Problem ${100 + i}`,
              status: 'ACCEPTED',
              submittedAt: new Date().toISOString(),
              score: 100,
            })),
            total: 5,
          }),
        });
      });

      // Mock CSV download
      const downloadPromise = page.waitForEvent('download');

      await page.goto('/profile?tab=submissions');

      // Click export button
      const exportButton = page.locator('[data-testid="export-csv-btn"]');
      await exportButton.click();

      const download = await downloadPromise;
      expect(download.suggestedFilename()).toContain('.csv');
    });

    /**
     * TEST 17: Generate performance report
     */
    test('should generate performance report', async () => {
      await page.route('**/api/users/profile/submissions/report*', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            report: {
              generatedAt: new Date().toISOString(),
              totalSubmissions: 156,
              acceptanceRate: 0.5,
              averageScore: 50,
              improvements: [
                { week: 'Week 1', accepted: 5, rejected: 10, trend: 'down' },
                { week: 'Week 2', accepted: 8, rejected: 7, trend: 'up' },
              ],
            },
          }),
        });
      });

      await page.route('**/api/users/profile/submissions*', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({ submissions: [], total: 0 }),
        });
      });

      await page.goto('/profile?tab=submissions');

      // Click generate report
      const reportButton = page.locator('[data-testid="generate-report-btn"]');
      await reportButton.click();

      // Verify report modal
      const reportModal = page.locator('[data-testid="report-modal"]');
      await expect(reportModal).toBeVisible();

      // Verify report content
      await expect(page.locator('[data-testid="report-acceptance-rate"]')).toContainText('50%');
    });
  });

  test.describe('Real-time Features', () => {
    /**
     * TEST 18: Real-time update when new submission comes in
     */
    test('should show real-time notification for new submission', async () => {
      await page.route('**/api/users/profile/submissions*', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            submissions: [
              { id: 'sub-1', problemId: 101, problemTitle: 'Problem A', status: 'ACCEPTED', submittedAt: new Date().toISOString(), score: 100 },
            ],
            total: 1,
          }),
        });
      });

      await page.goto('/profile?tab=submissions');

      // Verify initial submission
      let submissionRows = page.locator('[data-testid="submission-row"]');
      await expect(submissionRows).toHaveCount(1);

      // Simulate new submission WebSocket event
      await page.evaluate(() => {
        const event = new CustomEvent('new-submission', {
          detail: {
            id: 'sub-2',
            problemId: 102,
            problemTitle: 'Problem B',
            status: 'ACCEPTED',
            score: 100,
          },
        });
        window.dispatchEvent(event);
      });

      // Verify toast notification
      const notification = page.locator('[data-testid="submission-notification"]');
      await expect(notification).toContainText('New submission accepted');
    });
  });
});
