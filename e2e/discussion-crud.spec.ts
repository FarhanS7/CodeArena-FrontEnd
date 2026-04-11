import { test, expect, Page } from '@playwright/test';

/**
 * TDD RED Phase - Discussion Service CRUD & Upvoting
 * Tests for problem discussions with threads, replies, and voting
 */

test.describe('Discussion Service - CRUD & Upvoting (RED Phase)', () => {
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

  test.describe('Discussion Thread Display', () => {
    /**
     * TEST 1: Display problem discussions page
     */
    test('should display discussions for a problem', async () => {
      // Mock discussions endpoint
      await page.route('**/api/problems/123/discussions', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            discussions: [
              {
                id: 'disc-1',
                problemId: 123,
                authorId: 'user-2',
                author: 'alice',
                title: 'How to approach this problem?',
                content: 'What is the optimal strategy?',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                upvotes: 5,
                replies: 2,
                isUpvoted: false,
              },
              {
                id: 'disc-2',
                problemId: 123,
                authorId: 'user-3',
                author: 'bob',
                title: 'Solution approach',
                content: 'Try dynamic programming',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                upvotes: 3,
                replies: 1,
                isUpvoted: true,
              },
            ],
            total: 2,
          }),
        });
      });

      await page.goto('/problems/123/discussions');

      // Wait for discussions to load
      const discussionList = page.locator('[data-testid="discussion-list"]');
      await expect(discussionList).toBeVisible({ timeout: 5000 });

      // Verify discussions are displayed
      const threads = page.locator('[data-testid="discussion-thread"]');
      await expect(threads).toHaveCount(2);

      // Verify first discussion details
      const firstThread = threads.first();
      await expect(firstThread).toContainText('How to approach this problem?');
      await expect(firstThread).toContainText('alice');
      await expect(firstThread).toContainText('5');
    });

    /**
     * TEST 2: Display discussion details with replies
     */
    test('should show discussion replies when expanded', async () => {
      await page.route('**/api/problems/123/discussions', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            discussions: [
              {
                id: 'disc-1',
                problemId: 123,
                authorId: 'user-2',
                author: 'alice',
                title: 'Question',
                content: 'Content',
                createdAt: new Date().toISOString(),
                upvotes: 0,
                replies: 2,
                isUpvoted: false,
              },
            ],
          }),
        });
      });

      await page.route('**/api/discussions/disc-1/replies', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            replies: [
              {
                id: 'reply-1',
                discussionId: 'disc-1',
                authorId: 'user-1',
                author: 'testuser',
                content: 'First reply',
                createdAt: new Date().toISOString(),
                upvotes: 1,
                isUpvoted: true,
              },
              {
                id: 'reply-2',
                discussionId: 'disc-1',
                authorId: 'user-3',
                author: 'bob',
                content: 'Second reply',
                createdAt: new Date().toISOString(),
                upvotes: 0,
                isUpvoted: false,
              },
            ],
            total: 2,
          }),
        });
      });

      await page.goto('/problems/123/discussions');

      // Click to expand discussion
      const expandButton = page.locator('[data-testid="discussion-thread"]').first().locator('button:has-text("View")');
      await expandButton.click();

      // Wait for replies to load
      const replies = page.locator('[data-testid="discussion-reply"]');
      await expect(replies).toHaveCount(2, { timeout: 5000 });

      // Verify reply details
      await expect(replies.first()).toContainText('First reply');
      await expect(replies.last()).toContainText('Second reply');
    });

    /**
     * TEST 3: Display empty discussions state
     */
    test('should show empty state when no discussions', async () => {
      await page.route('**/api/problems/123/discussions', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({ discussions: [], total: 0 }),
        });
      });

      await page.goto('/problems/123/discussions');

      const emptyState = page.locator('[data-testid="empty-discussions"]');
      await expect(emptyState).toBeVisible({ timeout: 5000 });
      await expect(emptyState).toContainText('No discussions yet');
    });
  });

  test.describe('Discussion Creation', () => {
    /**
     * TEST 4: Create new discussion thread
     */
    test('should create new discussion thread', async () => {
      await page.route('**/api/problems/123/discussions', async (route) => {
        if (route.request().method() === 'POST') {
          const body = await route.request().postDataJSON();

          expect(body.title).toBe('New Discussion');
          expect(body.content).toBe('Discussion content here');

          await route.fulfill({
            status: 201,
            body: JSON.stringify({
              success: true,
              data: {
                id: 'disc-new',
                problemId: 123,
                title: body.title,
                content: body.content,
                author: 'testuser',
                upvotes: 0,
                replies: 0,
                createdAt: new Date().toISOString(),
              },
            }),
          });
        } else {
          await route.fulfill({
            status: 200,
            body: JSON.stringify({ discussions: [], total: 0 }),
          });
        }
      });

      await page.goto('/problems/123/discussions');

      // Click create button
      const createButton = page.locator('[data-testid="create-discussion-btn"]');
      await expect(createButton).toBeVisible();
      await createButton.click();

      // Fill form
      const titleInput = page.locator('[data-testid="discussion-title-input"]');
      const contentInput = page.locator('[data-testid="discussion-content-input"]');

      await titleInput.fill('New Discussion');
      await contentInput.fill('Discussion content here');

      // Submit
      const submitButton = page.locator('[data-testid="submit-discussion-btn"]');
      await submitButton.click();

      // Verify success message
      await expect(page.locator('text=/Discussion created successfully/')).toBeVisible({ timeout: 5000 });
    });

    /**
     * TEST 5: Validation on discussion creation
     */
    test('should validate discussion creation fields', async () => {
      await page.route('**/api/problems/123/discussions', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({ discussions: [], total: 0 }),
        });
      });

      await page.goto('/problems/123/discussions');

      const createButton = page.locator('[data-testid="create-discussion-btn"]');
      await createButton.click();

      // Try to submit empty form
      const submitButton = page.locator('[data-testid="submit-discussion-btn"]');
      await submitButton.click();

      // Should show validation errors
      const titleError = page.locator('[data-testid="title-error"]');
      const contentError = page.locator('[data-testid="content-error"]');

      await expect(titleError).toBeVisible();
      await expect(contentError).toBeVisible();
      await expect(titleError).toContainText('Title is required');
      await expect(contentError).toContainText('Content is required');
    });
  });

  test.describe('Discussion Replies', () => {
    /**
     * TEST 6: Add reply to discussion
     */
    test('should add reply to discussion thread', async () => {
      await page.route('**/api/problems/123/discussions', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            discussions: [
              {
                id: 'disc-1',
                problemId: 123,
                author: 'alice',
                title: 'Question',
                content: 'Content',
                createdAt: new Date().toISOString(),
                upvotes: 0,
                replies: 0,
                isUpvoted: false,
              },
            ],
          }),
        });
      });

      await page.route('**/api/discussions/disc-1/replies', async (route) => {
        if (route.request().method() === 'POST') {
          const body = await route.request().postDataJSON();

          await route.fulfill({
            status: 201,
            body: JSON.stringify({
              success: true,
              data: {
                id: 'reply-1',
                discussionId: 'disc-1',
                content: body.content,
                author: 'testuser',
                upvotes: 0,
                createdAt: new Date().toISOString(),
              },
            }),
          });
        } else {
          await route.fulfill({
            status: 200,
            body: JSON.stringify({ replies: [] }),
          });
        }
      });

      await page.goto('/problems/123/discussions');

      // Expand discussion
      const expandButton = page.locator('[data-testid="discussion-thread"]').first().locator('button');
      await expandButton.click();

      // Add reply
      const replyInput = page.locator('[data-testid="reply-input"]');
      await expect(replyInput).toBeVisible({ timeout: 5000 });
      await replyInput.fill('This is my reply');

      const replyButton = page.locator('[data-testid="submit-reply-btn"]');
      await replyButton.click();

      // Verify success
      await expect(page.locator('text=/Reply posted/')).toBeVisible({ timeout: 5000 });
    });

    /**
     * TEST 7: Reply count updates
     */
    test('should update reply count after adding reply', async () => {
      await page.route('**/api/problems/123/discussions', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            discussions: [
              {
                id: 'disc-1',
                problemId: 123,
                author: 'alice',
                title: 'Question',
                content: 'Content',
                createdAt: new Date().toISOString(),
                upvotes: 0,
                replies: 1,
                isUpvoted: false,
              },
            ],
          }),
        });
      });

      await page.goto('/problems/123/discussions');

      const replyCountBadge = page.locator('[data-testid="reply-count"]').first();
      const initialCount = await replyCountBadge.textContent();

      await page.route('**/api/discussions/disc-1/replies', async (route) => {
        if (route.request().method() === 'POST') {
          // Update reply count
          await page.route('**/api/problems/123/discussions', async (route2) => {
            await route2.fulfill({
              status: 200,
              body: JSON.stringify({
                discussions: [
                  {
                    id: 'disc-1',
                    replies: 2,
                    upvotes: 0,
                    author: 'alice',
                    title: 'Question',
                    content: 'Content',
                    createdAt: new Date().toISOString(),
                    isUpvoted: false,
                  },
                ],
              }),
            });
          });

          await route.fulfill({
            status: 201,
            body: JSON.stringify({
              success: true,
              data: {
                id: 'reply-new',
                discussionId: 'disc-1',
                content: 'New reply',
                author: 'testuser',
                upvotes: 0,
              },
            }),
          });
        } else {
          await route.fulfill({
            status: 200,
            body: JSON.stringify({ replies: [] }),
          });
        }
      });

      // Add reply
      const expandButton = page.locator('[data-testid="discussion-thread"]').first().locator('button');
      await expandButton.click();

      const replyInput = page.locator('[data-testid="reply-input"]');
      await replyInput.fill('New reply');

      const replyButton = page.locator('[data-testid="submit-reply-btn"]');
      await replyButton.click();

      // Check updated count
      await page.waitForTimeout(500);
      const updatedCount = await replyCountBadge.textContent();
      expect(updatedCount).not.toBe(initialCount);
    });
  });

  test.describe('Upvoting', () => {
    /**
     * TEST 8: Upvote discussion thread
     */
    test('should upvote discussion thread', async () => {
      await page.route('**/api/problems/123/discussions', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            discussions: [
              {
                id: 'disc-1',
                problemId: 123,
                author: 'alice',
                title: 'Question',
                content: 'Content',
                createdAt: new Date().toISOString(),
                upvotes: 5,
                replies: 0,
                isUpvoted: false,
              },
            ],
          }),
        });
      });

      await page.route('**/api/discussions/disc-1/upvote', async (route) => {
        if (route.request().method() === 'POST') {
          await route.fulfill({
            status: 200,
            body: JSON.stringify({
              success: true,
              data: { upvotes: 6, isUpvoted: true },
            }),
          });
        }
      });

      await page.goto('/problems/123/discussions');

      // Get initial upvote count
      const upvoteButton = page.locator('[data-testid="discussion-upvote-btn"]').first();
      await expect(upvoteButton).toContainText('5');

      // Click upvote
      await upvoteButton.click();

      // Verify count updated
      await expect(upvoteButton).toContainText('6', { timeout: 5000 });

      // Verify button is highlighted
      const hasHighlight = await upvoteButton.evaluate((el) =>
        el.classList.contains('text-blue-600'),
      );
      expect(hasHighlight).toBe(true);
    });

    /**
     * TEST 9: Remove upvote from discussion
     */
    test('should remove upvote from discussion', async () => {
      await page.route('**/api/problems/123/discussions', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            discussions: [
              {
                id: 'disc-1',
                problemId: 123,
                author: 'alice',
                title: 'Question',
                content: 'Content',
                createdAt: new Date().toISOString(),
                upvotes: 5,
                replies: 0,
                isUpvoted: true,
              },
            ],
          }),
        });
      });

      await page.route('**/api/discussions/disc-1/upvote', async (route) => {
        if (route.request().method() === 'DELETE') {
          await route.fulfill({
            status: 200,
            body: JSON.stringify({
              success: true,
              data: { upvotes: 4, isUpvoted: false },
            }),
          });
        }
      });

      await page.goto('/problems/123/discussions');

      const upvoteButton = page.locator('[data-testid="discussion-upvote-btn"]').first();
      await expect(upvoteButton).toContainText('5');

      // Click to remove upvote
      await upvoteButton.click();

      // Verify count decreased
      await expect(upvoteButton).toContainText('4', { timeout: 5000 });

      // Verify button is not highlighted
      const hasHighlight = await upvoteButton.evaluate((el) =>
        el.classList.contains('text-blue-600'),
      );
      expect(hasHighlight).toBe(false);
    });

    /**
     * TEST 10: Upvote reply in discussion
     */
    test('should upvote individual reply', async () => {
      await page.route('**/api/problems/123/discussions', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            discussions: [
              {
                id: 'disc-1',
                problemId: 123,
                author: 'alice',
                title: 'Question',
                content: 'Content',
                createdAt: new Date().toISOString(),
                upvotes: 0,
                replies: 1,
                isUpvoted: false,
              },
            ],
          }),
        });
      });

      await page.route('**/api/discussions/disc-1/replies', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            replies: [
              {
                id: 'reply-1',
                discussionId: 'disc-1',
                author: 'bob',
                content: 'Great solution',
                createdAt: new Date().toISOString(),
                upvotes: 3,
                isUpvoted: false,
              },
            ],
          }),
        });
      });

      await page.route('**/api/discussions/disc-1/replies/reply-1/upvote', async (route) => {
        if (route.request().method() === 'POST') {
          await route.fulfill({
            status: 200,
            body: JSON.stringify({
              success: true,
              data: { upvotes: 4, isUpvoted: true },
            }),
          });
        }
      });

      await page.goto('/problems/123/discussions');

      // Expand discussion
      const expandButton = page.locator('[data-testid="discussion-thread"]').first().locator('button');
      await expandButton.click();

      // Upvote reply
      const replyUpvoteButton = page.locator('[data-testid="reply-upvote-btn"]').first();
      await expect(replyUpvoteButton).toContainText('3');

      await replyUpvoteButton.click();

      // Verify count updated
      await expect(replyUpvoteButton).toContainText('4', { timeout: 5000 });
    });
  });

  test.describe('Discussion Editing & Deletion', () => {
    /**
     * TEST 11: Edit own discussion
     */
    test('should edit own discussion thread', async () => {
      await page.route('**/api/problems/123/discussions', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            discussions: [
              {
                id: 'disc-1',
                problemId: 123,
                authorId: 'user-1',
                author: 'testuser',
                title: 'Original Title',
                content: 'Original content',
                createdAt: new Date().toISOString(),
                upvotes: 0,
                replies: 0,
                isUpvoted: false,
              },
            ],
          }),
        });
      });

      await page.route('**/api/discussions/disc-1', async (route) => {
        if (route.request().method() === 'PUT') {
          const body = await route.request().postDataJSON();

          await route.fulfill({
            status: 200,
            body: JSON.stringify({
              success: true,
              data: {
                id: 'disc-1',
                title: body.title,
                content: body.content,
                updatedAt: new Date().toISOString(),
              },
            }),
          });
        }
      });

      await page.goto('/problems/123/discussions');

      // Click edit button on own discussion
      const editButton = page.locator('[data-testid="discussion-edit-btn"]').first();
      await expect(editButton).toBeVisible();
      await editButton.click();

      // Update content
      const titleInput = page.locator('[data-testid="discussion-title-input"]');
      await titleInput.clear();
      await titleInput.fill('Updated Title');

      // Save
      const saveButton = page.locator('[data-testid="save-discussion-btn"]');
      await saveButton.click();

      // Verify success
      await expect(page.locator('text=/Discussion updated/')).toBeVisible({ timeout: 5000 });
    });

    /**
     * TEST 12: Delete own discussion
     */
    test('should delete own discussion thread', async () => {
      await page.route('**/api/problems/123/discussions', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            discussions: [
              {
                id: 'disc-1',
                problemId: 123,
                authorId: 'user-1',
                author: 'testuser',
                title: 'My Discussion',
                content: 'Content',
                createdAt: new Date().toISOString(),
                upvotes: 0,
                replies: 0,
                isUpvoted: false,
              },
            ],
          }),
        });
      });

      await page.route('**/api/discussions/disc-1', async (route) => {
        if (route.request().method() === 'DELETE') {
          await route.fulfill({
            status: 200,
            body: JSON.stringify({ success: true }),
          });
        }
      });

      await page.goto('/problems/123/discussions');

      // Click delete button
      const deleteButton = page.locator('[data-testid="discussion-delete-btn"]').first();
      await deleteButton.click();

      // Confirm deletion in dialog
      const confirmButton = page.locator('[data-testid="confirm-delete-btn"]');
      await confirmButton.click();

      // Verify empty state
      await expect(page.locator('[data-testid="empty-discussions"]')).toBeVisible({ timeout: 5000 });
    });

    /**
     * TEST 13: Cannot edit/delete others' discussions
     */
    test('should not allow editing others\' discussions', async () => {
      await page.route('**/api/problems/123/discussions', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            discussions: [
              {
                id: 'disc-1',
                problemId: 123,
                authorId: 'user-2',
                author: 'alice',
                title: 'Alice\'s Discussion',
                content: 'Content',
                createdAt: new Date().toISOString(),
                upvotes: 0,
                replies: 0,
                isUpvoted: false,
              },
            ],
          }),
        });
      });

      await page.goto('/problems/123/discussions');

      // Edit button should not exist
      const editButton = page.locator('[data-testid="discussion-edit-btn"]');
      await expect(editButton).not.toBeVisible();

      // Delete button should not exist
      const deleteButton = page.locator('[data-testid="discussion-delete-btn"]');
      await expect(deleteButton).not.toBeVisible();
    });
  });

  test.describe('Discussion Search & Filtering', () => {
    /**
     * TEST 14: Search discussions
     */
    test('should search discussions by keyword', async () => {
      await page.route('**/api/problems/123/discussions?search=algorithm', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            discussions: [
              {
                id: 'disc-1',
                problemId: 123,
                author: 'alice',
                title: 'Algorithm question',
                content: 'How does this algorithm work?',
                createdAt: new Date().toISOString(),
                upvotes: 5,
                replies: 2,
                isUpvoted: false,
              },
            ],
            total: 1,
          }),
        });
      });

      await page.goto('/problems/123/discussions');

      // Type in search
      const searchInput = page.locator('[data-testid="discussion-search-input"]');
      await searchInput.fill('algorithm');

      // Press enter to search
      await searchInput.press('Enter');

      // Verify filtered results
      const threads = page.locator('[data-testid="discussion-thread"]');
      await expect(threads).toHaveCount(1, { timeout: 5000 });
      await expect(threads.first()).toContainText('Algorithm question');
    });

    /**
     * TEST 15: Sort discussions by upvotes
     */
    test('should sort discussions by upvotes', async () => {
      await page.route('**/api/problems/123/discussions?sort=upvotes', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            discussions: [
              {
                id: 'disc-1',
                problemId: 123,
                author: 'alice',
                title: 'Most upvoted',
                content: 'Content',
                createdAt: new Date().toISOString(),
                upvotes: 10,
                replies: 1,
                isUpvoted: false,
              },
              {
                id: 'disc-2',
                problemId: 123,
                author: 'bob',
                title: 'Less upvoted',
                content: 'Content',
                createdAt: new Date().toISOString(),
                upvotes: 3,
                replies: 0,
                isUpvoted: false,
              },
            ],
          }),
        });
      });

      await page.goto('/problems/123/discussions');

      // Click sort button
      const sortButton = page.locator('[data-testid="sort-selector"]');
      await sortButton.selectOption('upvotes');

      // Verify sorted
      const threads = page.locator('[data-testid="discussion-thread"]');
      const firstThread = threads.first();
      await expect(firstThread).toContainText('Most upvoted');
      await expect(firstThread).toContainText('10');
    });
  });

  test.describe('Discussion Permissions', () => {
    /**
     * TEST 16: Show edit menu only for author
     */
    test('should show edit menu only for discussion author', async () => {
      await page.route('**/api/problems/123/discussions', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            discussions: [
              {
                id: 'disc-1',
                problemId: 123,
                authorId: 'user-1',
                author: 'testuser',
                title: 'My Discussion',
                content: 'Content',
                createdAt: new Date().toISOString(),
                upvotes: 0,
                replies: 0,
                isUpvoted: false,
              },
            ],
          }),
        });
      });

      await page.goto('/problems/123/discussions');

      // Edit options should be visible
      const editButton = page.locator('[data-testid="discussion-edit-btn"]');
      const deleteButton = page.locator('[data-testid="discussion-delete-btn"]');

      await expect(editButton).toBeVisible();
      await expect(deleteButton).toBeVisible();
    });
  });
});
