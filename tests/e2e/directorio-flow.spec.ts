/**
 * E2E test: Home → Directorio → Search → View Profile
 * Tests the complete directory browsing and search flow
 */
import { test, expect } from '@playwright/test'

test.describe('Directorio Flow', () => {
  test('should navigate from home to directory and search for exaltados', async ({ page }) => {
    // Navigate to home page
    await page.goto('/')

    // Verify home page loaded
    await expect(page).toHaveTitle(/Pabellón/i)

    // Find and click Directorio navigation link
    const directorioLink = page.getByRole('link', { name: /directorio/i })
    await directorioLink.click()

    // Wait for directory page to load
    await page.waitForURL(/\/directorio/)
    await expect(page).toHaveURL(/\/directorio/)

    // Verify directory page elements
    await expect(page.getByRole('heading', { name: /directorio/i })).toBeVisible()

    // Find the search input
    const searchInput = page.getByPlaceholder(/buscar/i)
    await expect(searchInput).toBeVisible()

    // Type a search query
    await searchInput.fill('Roberto')
    await page.waitForTimeout(500) // Wait for debounce/filtering

    // Verify search results are displayed (cards or list items)
    const exaltadoCards = page.locator('[data-testid="exaltado-card"], .exaltado-card, article, [role="article"]').first()

    // Wait for at least one result to appear
    await expect(exaltadoCards).toBeVisible({ timeout: 5000 })

    // Click on first result to view profile
    await exaltadoCards.click()

    // Verify profile/detail page is displayed
    // Could be a modal or a new page
    await page.waitForTimeout(500)

    // Check for profile content (biography, achievements, etc.)
    const profileContent = page.locator('text=/biografía|logros|reconocimientos/i').first()
    await expect(profileContent).toBeVisible({ timeout: 5000 })
  })

  test('should filter exaltados by deporte', async ({ page }) => {
    await page.goto('/directorio')

    // Wait for page to load
    await page.waitForLoadState('networkidle')

    // Look for filter section
    const filterSection = page.getByText(/filtros|deporte/i).first()

    if (await filterSection.isVisible({ timeout: 2000 })) {
      // Find filter button or select for "Béisbol"
      const beisbolFilter = page.getByRole('button', { name: /béisbol/i }).or(
        page.getByRole('checkbox', { name: /béisbol/i })
      ).first()

      if (await beisbolFilter.isVisible({ timeout: 2000 })) {
        await beisbolFilter.click()
        await page.waitForTimeout(500)

        // Verify filtered results
        const firstCard = page.locator('[data-testid="exaltado-card"], article').first()
        await expect(firstCard).toContainText(/béisbol/i, { timeout: 5000 })
      }
    }
  })

  test('should clear search and show all exaltados', async ({ page }) => {
    await page.goto('/directorio')

    // Search for something
    const searchInput = page.getByPlaceholder(/buscar/i)
    await searchInput.fill('Test Search')
    await page.waitForTimeout(500)

    // Click clear button
    const clearButton = page.getByLabel(/limpiar|clear/i)
    if (await clearButton.isVisible({ timeout: 2000 })) {
      await clearButton.click()
      await page.waitForTimeout(500)

      // Verify search is cleared
      await expect(searchInput).toHaveValue('')
    }
  })

  test('should navigate through pagination', async ({ page }) => {
    await page.goto('/directorio')
    await page.waitForLoadState('networkidle')

    // Look for pagination controls
    const nextButton = page.getByRole('button', { name: /siguiente|next/i }).or(
      page.locator('[aria-label*="siguiente"], [aria-label*="next"]')
    ).first()

    if (await nextButton.isVisible({ timeout: 2000 })) {
      // Scroll pagination into view
      await nextButton.scrollIntoViewIfNeeded()

      if (await nextButton.isEnabled()) {
        await nextButton.click()
        await page.waitForTimeout(500)

        // Verify URL updated or content changed
        await expect(page).toHaveURL(/page=2|offset/)
      }
    }
  })

  test('should handle empty search results', async ({ page }) => {
    await page.goto('/directorio')

    const searchInput = page.getByPlaceholder(/buscar/i)
    await searchInput.fill('XYZ_NO_RESULTS_EXPECTED_12345')
    await page.waitForTimeout(500)

    // Look for "no results" message
    const noResults = page.getByText(/no se encontraron|no results|sin resultados/i)
    await expect(noResults).toBeVisible({ timeout: 5000 })
  })

  test('should be responsive on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/directorio')

    // Verify page loads and is usable
    const searchInput = page.getByPlaceholder(/buscar/i)
    await expect(searchInput).toBeVisible()

    // Verify layout is mobile-friendly (elements are stacked, not overflowing)
    const body = page.locator('body')
    const bodyWidth = await body.evaluate(el => el.scrollWidth)
    expect(bodyWidth).toBeLessThanOrEqual(375)
  })
})
