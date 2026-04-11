import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Start from the homepage before each test
    await page.goto('/')
  })

  test.describe('Login Page', () => {
    test('should display login form', async ({ page }) => {
      await page.goto('/login')

      // Check that login form is visible
      await expect(page.locator('h1')).toContainText('Login')
      await expect(page.locator('input[type="email"]')).toBeVisible()
      await expect(page.locator('input[type="password"]')).toBeVisible()
      await expect(page.locator('button[type="submit"]')).toBeVisible()
    })

    test('should show validation errors for empty form', async ({ page }) => {
      await page.goto('/login')

      // Try to submit without filling the form
      await page.click('button[type="submit"]')

      // HTML5 validation should prevent submission
      const emailInput = page.locator('input[type="email"]')
      await expect(emailInput).toHaveAttribute('required')

      const passwordInput = page.locator('input[type="password"]')
      await expect(passwordInput).toHaveAttribute('required')
    })

    test('should show error for invalid credentials', async ({ page }) => {
      await page.goto('/login')

      // Fill in invalid credentials
      await page.fill('input[type="email"]', 'invalid@example.com')
      await page.fill('input[type="password"]', 'wrongpassword')
      await page.click('button[type="submit"]')

      // Should show error message (assuming backend validation)
      await expect(page.locator('text=Invalid email or password')).toBeVisible({ timeout: 5000 })
    })

    test('should navigate to signup page', async ({ page }) => {
      await page.goto('/login')

      // Look for signup link and click it
      const signupLink = page.locator('a[href="/signup"]').first()
      if (await signupLink.count() > 0) {
        await signupLink.click()
        await expect(page).toHaveURL('/signup')
      }
    })
  })

  test.describe('Signup Page', () => {
    test('should display signup form', async ({ page }) => {
      await page.goto('/signup')

      // Check that signup form is visible
      await expect(page.locator('h1')).toContainText('Sign up')
      await expect(page.locator('input[type="text"]').first()).toBeVisible() // username
      await expect(page.locator('input[type="email"]')).toBeVisible()
      await expect(page.locator('input[type="password"]')).toBeVisible()
      await expect(page.locator('button[type="submit"]')).toBeVisible()
    })

    test('should show validation for password requirements', async ({ page }) => {
      await page.goto('/signup')

      // Fill in form with weak password
      await page.fill('input[type="text"]', 'testuser')
      await page.fill('input[type="email"]', 'test@example.com')
      await page.fill('input[type="password"]', '123') // weak password

      // Try to submit
      await page.click('button[type="submit"]')

      // Should prevent submission or show validation message
      const passwordInput = page.locator('input[type="password"]')
      const isRequired = await passwordInput.getAttribute('minlength')
      if (isRequired) {
        expect(parseInt(isRequired)).toBeGreaterThan(3)
      }
    })
  })

  test.describe('Navigation', () => {
    test('should redirect unauthenticated users from protected routes', async ({ page }) => {
      // Try to access dashboard without authentication
      await page.goto('/dashboard')

      // Should redirect to login
      await expect(page).toHaveURL('/login')
    })

    test('should allow access to public pages', async ({ page }) => {
      // Test public pages
      const publicPages = ['/', '/leaderboard']

      for (const pagePath of publicPages) {
        await page.goto(pagePath)

        // Should not redirect to login
        expect(page.url()).not.toContain('/login')

        // Page should load without errors
        const errorMessage = page.locator('text=404').or(page.locator('text=Error'))
        await expect(errorMessage).not.toBeVisible()
      }
    })
  })

  test.describe('User Interface', () => {
    test('should be responsive on mobile devices', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 })

      await page.goto('/login')

      // Check that form is still usable on mobile
      await expect(page.locator('input[type="email"]')).toBeVisible()
      await expect(page.locator('input[type="password"]')).toBeVisible()
      await expect(page.locator('button[type="submit"]')).toBeVisible()

      // Check that elements don't overflow
      const form = page.locator('form')
      const formBox = await form.boundingBox()
      if (formBox) {
        expect(formBox.width).toBeLessThanOrEqual(375)
      }
    })

    test('should support keyboard navigation', async ({ page }) => {
      await page.goto('/login')

      // Focus on first input
      await page.keyboard.press('Tab')

      // Should be able to navigate through form with Tab
      const emailInput = page.locator('input[type="email"]')
      await expect(emailInput).toBeFocused()

      await page.keyboard.press('Tab')

      const passwordInput = page.locator('input[type="password"]')
      await expect(passwordInput).toBeFocused()

      await page.keyboard.press('Tab')

      const submitButton = page.locator('button[type="submit"]')
      await expect(submitButton).toBeFocused()
    })

    test('should have proper accessibility attributes', async ({ page }) => {
      await page.goto('/login')

      // Check for proper labeling
      const emailInput = page.locator('input[type="email"]')
      const passwordInput = page.locator('input[type="password"]')

      // Inputs should have labels or aria-label
      const emailLabel = await emailInput.getAttribute('aria-label') || await page.locator('label').filter({ hasText: 'Email' }).count()
      const passwordLabel = await passwordInput.getAttribute('aria-label') || await page.locator('label').filter({ hasText: 'Password' }).count()

      expect(emailLabel).toBeTruthy()
      expect(passwordLabel).toBeTruthy()

      // Form should have proper heading structure
      await expect(page.locator('h1')).toBeVisible()
    })
  })

  test.describe('Performance', () => {
    test('should load login page quickly', async ({ page }) => {
      const startTime = Date.now()

      await page.goto('/login')

      // Check that main content is visible
      await expect(page.locator('h1')).toBeVisible()

      const loadTime = Date.now() - startTime

      // Should load within 3 seconds (adjust based on your requirements)
      expect(loadTime).toBeLessThan(3000)
    })

    test('should not have console errors', async ({ page }) => {
      const consoleErrors: string[] = []

      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text())
        }
      })

      await page.goto('/login')

      // Wait for page to fully load
      await page.waitForLoadState('networkidle')

      // Check for console errors (filter out known testing-related errors)
      const criticalErrors = consoleErrors.filter(error =>
        !error.includes('404') &&
        !error.includes('favicon') &&
        !error.includes('WebSocket')
      )

      expect(criticalErrors).toHaveLength(0)
    })
  })
})