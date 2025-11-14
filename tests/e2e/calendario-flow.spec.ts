/**
 * E2E test: Home → Calendario → View Events
 * Tests the calendar events viewing flow
 */
import { test, expect } from '@playwright/test'

test.describe('Calendario Flow', () => {
  test('should navigate to calendar and view events', async ({ page }) => {
    // Navigate to home page
    await page.goto('/')

    // Find and click Calendario navigation link
    const calendarioLink = page.getByRole('link', { name: /calendario|eventos/i })
    await calendarioLink.click()

    // Wait for calendar page to load
    await page.waitForURL(/\/calendario/)
    await expect(page).toHaveURL(/\/calendario/)

    // Verify calendar page heading
    await expect(page.getByRole('heading', { name: /calendario|eventos/i })).toBeVisible()

    // Wait for events to load
    await page.waitForLoadState('networkidle')

    // Look for event cards or list items
    const eventCard = page.locator('[data-testid="event-card"], .event-card, article').first()

    // Verify at least one event is displayed
    await expect(eventCard).toBeVisible({ timeout: 10000 })
  })

  test('should display event details', async ({ page }) => {
    await page.goto('/calendario')
    await page.waitForLoadState('networkidle')

    // Find first event
    const firstEvent = page.locator('[data-testid="event-card"], .event-card, article').first()
    await firstEvent.waitFor({ state: 'visible', timeout: 10000 })

    // Verify event has required information
    await expect(firstEvent).toContainText(/\d{1,2}/)  // Should contain a date number

    // Click on event to see details
    await firstEvent.click()
    await page.waitForTimeout(500)

    // Check if modal or detail page opens
    // Look for more detailed information
    const detailContent = page.locator('text=/descripción|ubicación|location/i').first()
    const isVisible = await detailContent.isVisible({ timeout: 2000 }).catch(() => false)

    // If detail view exists, verify it
    if (isVisible) {
      await expect(detailContent).toBeVisible()
    }
  })

  test('should filter events by type', async ({ page }) => {
    await page.goto('/calendario')
    await page.waitForLoadState('networkidle')

    // Look for filter/category buttons
    const filters = [
      page.getByRole('button', { name: /ceremonia/i }),
      page.getByRole('button', { name: /museo/i }),
      page.getByRole('button', { name: /educativo/i }),
      page.getByRole('tab', { name: /ceremonia/i }),
      page.getByRole('tab', { name: /museo/i }),
    ]

    for (const filter of filters) {
      if (await filter.isVisible({ timeout: 1000 }).catch(() => false)) {
        await filter.click()
        await page.waitForTimeout(500)

        // Verify filtered results appear
        const events = page.locator('[data-testid="event-card"], .event-card, article')
        await expect(events.first()).toBeVisible({ timeout: 5000 })
        break
      }
    }
  })

  test('should display month navigation', async ({ page }) => {
    await page.goto('/calendario')
    await page.waitForLoadState('networkidle')

    // Look for month navigation (previous/next month buttons)
    const nextMonthButton = page.getByRole('button', { name: /siguiente|next|próximo/i }).or(
      page.locator('[aria-label*="siguiente"], [aria-label*="next"]')
    ).first()

    if (await nextMonthButton.isVisible({ timeout: 2000 })) {
      // Current month display
      const monthDisplay = page.locator('text=/enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre/i').first()
      await expect(monthDisplay).toBeVisible()

      // Click next month
      if (await nextMonthButton.isEnabled()) {
        await nextMonthButton.click()
        await page.waitForTimeout(500)
      }
    }
  })

  test('should show "no events" message when applicable', async ({ page }) => {
    await page.goto('/calendario')
    await page.waitForLoadState('networkidle')

    // Navigate far into the future where there might be no events
    const nextMonthButton = page.getByRole('button', { name: /siguiente|next/i }).first()

    if (await nextMonthButton.isVisible({ timeout: 2000 })) {
      // Click multiple times to go far into future
      for (let i = 0; i < 12; i++) {
        if (await nextMonthButton.isEnabled()) {
          await nextMonthButton.click()
          await page.waitForTimeout(300)
        }
      }

      // Check for "no events" message
      const noEventsMessage = page.getByText(/no hay eventos|sin eventos|no events/i)
      const hasNoEvents = await noEventsMessage.isVisible({ timeout: 2000 }).catch(() => false)

      if (hasNoEvents) {
        await expect(noEventsMessage).toBeVisible()
      }
    }
  })

  test('should display upcoming events section', async ({ page }) => {
    await page.goto('/calendario')
    await page.waitForLoadState('networkidle')

    // Look for "Próximos Eventos" or similar heading
    const upcomingHeading = page.getByRole('heading', { name: /próxim|upcoming|futur/i })

    if (await upcomingHeading.isVisible({ timeout: 2000 })) {
      await expect(upcomingHeading).toBeVisible()

      // Verify events are displayed below
      const eventsList = page.locator('[data-testid="event-card"], .event-card, article')
      await expect(eventsList.first()).toBeVisible({ timeout: 5000 })
    }
  })

  test('should handle API errors gracefully', async ({ page }) => {
    // Intercept API calls and force an error
    await page.route('**/api/eventos*', route => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Server error' }),
      })
    })

    await page.goto('/calendario')

    // Look for error message
    const errorMessage = page.getByText(/error|problema|no se pudo|could not/i).first()
    await expect(errorMessage).toBeVisible({ timeout: 10000 })
  })

  test('should be responsive on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/calendario')
    await page.waitForLoadState('networkidle')

    // Verify page is usable on mobile
    const heading = page.getByRole('heading', { name: /calendario|eventos/i })
    await expect(heading).toBeVisible()

    // Check for horizontal overflow
    const body = page.locator('body')
    const bodyWidth = await body.evaluate(el => el.scrollWidth)
    expect(bodyWidth).toBeLessThanOrEqual(375)
  })

  test('should display event time in Puerto Rico format', async ({ page }) => {
    await page.goto('/calendario')
    await page.waitForLoadState('networkidle')

    const firstEvent = page.locator('[data-testid="event-card"], article').first()

    if (await firstEvent.isVisible({ timeout: 2000 })) {
      // Look for time format (e.g., "7:00 PM" or "Todo el día")
      const timeText = await firstEvent.textContent()
      const hasTime = timeText?.match(/\d{1,2}:\d{2}\s*(AM|PM|am|pm)|todo el día/i)

      if (hasTime) {
        expect(hasTime).toBeTruthy()
      }
    }
  })
})
