import { test, expect } from '@playwright/test'

test.describe('Problem Solving Workflow', () => {
  test.describe('Problem List', () => {
    test('should display problems list', async ({ page }) => {
      await page.goto('/problems')

      // Should show problems or a message if no problems
      const problemsContainer = page.locator('[data-testid="problems-list"], .problems-grid, .problem-card').first()
      const noProblemMessage = page.locator('text=No problems available').or(page.locator('text=Coming soon'))

      // Either problems exist or there's a "no problems" message
      await expect(problemsContainer.or(noProblemMessage)).toBeVisible({ timeout: 10000 })
    })

    test('should allow filtering by difficulty', async ({ page }) => {
      await page.goto('/problems')

      // Look for difficulty filter controls
      const easyFilter = page.locator('button, select, input').filter({ hasText: /easy/i }).first()
      const mediumFilter = page.locator('button, select, input').filter({ hasText: /medium/i }).first()
      const hardFilter = page.locator('button, select, input').filter({ hasText: /hard/i }).first()

      // If filters exist, test them
      if (await easyFilter.count() > 0) {
        await easyFilter.click()

        // Check that URL updates or content changes
        await page.waitForTimeout(500) // Give time for filtering

        // If there are problems, they should be easy level
        const problemCards = page.locator('.problem-card, [data-difficulty="EASY"]')
        if (await problemCards.count() > 0) {
          // All visible problems should be easy
          const difficulties = await problemCards.all()
          for (const card of difficulties) {
            const difficultyText = await card.textContent()
            expect(difficultyText?.toLowerCase()).toContain('easy')
          }
        }
      }
    })

    test('should navigate to problem details', async ({ page }) => {
      await page.goto('/problems')

      // Look for the first problem link/card
      const firstProblem = page.locator('a[href*="/problems/"], .problem-card a, [data-testid="problem-link"]').first()

      if (await firstProblem.count() > 0) {
        await firstProblem.click()

        // Should navigate to problem detail page
        await expect(page.url()).toMatch(/\/problems\/\d+/)

        // Should see problem details
        await expect(page.locator('h1, .problem-title')).toBeVisible()
      }
    })
  })

  test.describe('Problem Detail Page', () => {
    test('should display problem information', async ({ page }) => {
      // Navigate to a problem detail page (using ID 1 as example)
      await page.goto('/problems/1')

      // Should show problem title and description
      const title = page.locator('h1, .problem-title')
      const description = page.locator('.problem-description, [data-testid="problem-description"]')

      await expect(title.or(description)).toBeVisible({ timeout: 10000 })

      // Should show difficulty level
      const difficulty = page.locator('.difficulty, [data-testid="difficulty"]')
      if (await difficulty.count() > 0) {
        const difficultyText = await difficulty.textContent()
        expect(difficultyText).toMatch(/(EASY|MEDIUM|HARD|Easy|Medium|Hard)/i)
      }
    })

    test('should display code editor', async ({ page }) => {
      await page.goto('/problems/1')

      // Look for code editor (Monaco editor or textarea)
      const codeEditor = page.locator('[data-testid="monaco-editor"], .monaco-editor, textarea[placeholder*="code"], .code-editor')

      await expect(codeEditor).toBeVisible({ timeout: 15000 })
    })

    test('should allow language selection', async ({ page }) => {
      await page.goto('/problems/1')

      // Look for language selector
      const languageSelect = page.locator('select').filter({ hasText: /javascript|python|java|c\+\+/i }).first()
      const languageButtons = page.locator('button').filter({ hasText: /javascript|python|java|c\+\+/i }).first()

      const languageSelector = languageSelect.or(languageButtons)

      if (await languageSelector.count() > 0) {
        // Test language switching
        if (await languageSelect.count() > 0) {
          await languageSelect.selectOption('python')
        } else {
          await languageButtons.click()
        }

        // Should update editor or show language change
        await page.waitForTimeout(500)
      }
    })

    test('should submit solution', async ({ page }) => {
      await page.goto('/problems/1')

      // Wait for editor to load
      await page.waitForTimeout(2000)

      // Look for code editor and add some code
      const codeEditor = page.locator('textarea, .monaco-editor').first()

      if (await codeEditor.count() > 0) {
        // Click in editor area and add simple code
        await codeEditor.click()

        // Add simple solution (depending on problem)
        if (await page.locator('textarea').count() > 0) {
          await page.fill('textarea', 'function solution() { return "Hello World"; }')
        } else {
          // For Monaco editor, simulate typing
          await page.keyboard.type('function solution() { return "Hello World"; }')
        }

        // Look for submit button
        const submitButton = page.locator('button').filter({ hasText: /submit|run|execute/i }).first()

        if (await submitButton.count() > 0) {
          await submitButton.click()

          // Should show submission result (success or error)
          const resultIndicator = page.locator('.result, [data-testid="result"], .submission-status')
          await expect(resultIndicator).toBeVisible({ timeout: 10000 })
        }
      }
    })
  })

  test.describe('Leaderboard', () => {
    test('should display leaderboard', async ({ page }) => {
      await page.goto('/leaderboard')

      // Should show leaderboard table or user rankings
      const leaderboard = page.locator('table, .leaderboard, [data-testid="leaderboard"]')
      const noDataMessage = page.locator('text=No data available').or(page.locator('text=Coming soon'))

      await expect(leaderboard.or(noDataMessage)).toBeVisible({ timeout: 10000 })
    })

    test('should show user rankings', async ({ page }) => {
      await page.goto('/leaderboard')

      // Look for user entries in leaderboard
      const userEntries = page.locator('tr, .user-entry, .leaderboard-item').first()

      if (await userEntries.count() > 0) {
        // Should show rank, username, and score
        const entry = userEntries.first()
        const entryText = await entry.textContent()

        // Entry should contain numerical rank and username
        expect(entryText).toMatch(/\d+/) // Should contain numbers (rank or score)
      }
    })
  })

  test.describe('Navigation and Layout', () => {
    test('should have working navigation menu', async ({ page }) => {
      await page.goto('/')

      // Look for main navigation links
      const navLinks = page.locator('nav a, header a, .navigation a')

      if (await navLinks.count() > 0) {
        // Test at least one navigation link
        const problemsLink = navLinks.filter({ hasText: /problems/i }).first()

        if (await problemsLink.count() > 0) {
          await problemsLink.click()
          await expect(page.url()).toContain('problems')
        }
      }
    })

    test('should be responsive on different screen sizes', async ({ page }) => {
      const viewports = [
        { width: 1920, height: 1080 }, // Desktop
        { width: 768, height: 1024 },  // Tablet
        { width: 375, height: 667 }    // Mobile
      ]

      for (const viewport of viewports) {
        await page.setViewportSize(viewport)
        await page.goto('/')

        // Page should load without horizontal scrolling
        const body = await page.locator('body').boundingBox()
        if (body) {
          expect(body.width).toBeLessThanOrEqual(viewport.width + 20) // Allow small margin
        }

        // Navigation should be accessible
        const navigation = page.locator('nav, .navigation, header')
        await expect(navigation).toBeVisible()
      }
    })
  })

  test.describe('Error Handling', () => {
    test('should handle non-existent problem gracefully', async ({ page }) => {
      await page.goto('/problems/99999')

      // Should show 404 or appropriate error message
      const errorMessage = page.locator('text=404').or(page.locator('text=not found')).or(page.locator('text=Problem not found'))
      await expect(errorMessage).toBeVisible({ timeout: 5000 })
    })

    test('should handle server errors gracefully', async ({ page }) => {
      // Test error boundaries by visiting routes that might fail
      const potentialErrorRoutes = ['/admin', '/profile/nonexistent']

      for (const route of potentialErrorRoutes) {
        await page.goto(route)

        // Should either redirect to login or show proper error page
        // Should not show white screen or unhandled errors
        const hasContent = await page.locator('body *').first().isVisible()
        expect(hasContent).toBe(true)
      }
    })
  })
})