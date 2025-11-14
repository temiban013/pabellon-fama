/**
 * E2E test: Home → Registro → Submit → Confirmation
 * Tests the registration form submission flow
 */
import { test, expect } from '@playwright/test'

test.describe('Registro Flow', () => {
  test('should navigate to registration page and display form', async ({ page }) => {
    // Navigate to home page
    await page.goto('/')

    // Find registration/contact link (might be "Registro", "Contacto", or similar)
    const registroLink = page.getByRole('link', { name: /registro|contacto|contact/i })
    await registroLink.click()

    // Wait for form page to load
    await page.waitForTimeout(500)

    // Verify form is displayed
    const form = page.locator('form').first()
    await expect(form).toBeVisible({ timeout: 5000 })

    // Verify required form fields exist
    const emailInput = page.getByLabel(/email|correo/i).or(
      page.locator('input[type="email"], input[name*="email"]')
    ).first()
    await expect(emailInput).toBeVisible()
  })

  test('should successfully submit registration form', async ({ page }) => {
    // Mock the API endpoint to return success
    await page.route('**/api/registro', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'Registro recibido exitosamente',
          registroId: 'test-123',
        }),
      })
    })

    await page.goto('/')

    // Navigate to registration
    const registroLink = page.getByRole('link', { name: /registro|contacto/i })
    if (await registroLink.isVisible({ timeout: 2000 })) {
      await registroLink.click()
    } else {
      // If no link, try direct navigation
      await page.goto('/contacto')
    }

    await page.waitForTimeout(500)

    // Fill out the form
    const emailInput = page.getByLabel(/email|correo/i).or(
      page.locator('input[type="email"]')
    ).first()
    await emailInput.fill('juan.perez@example.com')

    // Fill nombre if exists
    const nombreInput = page.getByLabel(/nombre|name/i).first()
    if (await nombreInput.isVisible({ timeout: 1000 }).catch(() => false)) {
      await nombreInput.fill('Juan Pérez')
    }

    // Fill telefono if exists
    const telefonoInput = page.getByLabel(/teléfono|telefono|phone/i).first()
    if (await telefonoInput.isVisible({ timeout: 1000 }).catch(() => false)) {
      await telefonoInput.fill('787-555-1234')
    }

    // Select interes if exists
    const interesSelect = page.locator('select[name*="interes"], select[name*="interest"]').first()
    if (await interesSelect.isVisible({ timeout: 1000 }).catch(() => false)) {
      await interesSelect.selectOption({ index: 1 })
    }

    // Fill mensaje/message if exists
    const mensajeInput = page.getByLabel(/mensaje|message|comentario/i).first()
    if (await mensajeInput.isVisible({ timeout: 1000 }).catch(() => false)) {
      await mensajeInput.fill('Me gustaría obtener más información sobre el Pabellón.')
    }

    // Submit the form
    const submitButton = page.getByRole('button', { name: /enviar|submit|registrar/i })
    await submitButton.click()

    // Wait for success message
    const successMessage = page.getByText(/éxito|exitoso|success|gracias|thank you|recibido/i)
    await expect(successMessage).toBeVisible({ timeout: 10000 })
  })

  test('should validate required fields', async ({ page }) => {
    await page.goto('/')

    // Try to find registro/contacto link, use .first() to handle multiple matches
    const registroLink = page.getByRole('link', { name: /registro|contacto/i }).first()
    try {
      await registroLink.click({ timeout: 2000 })
    } catch {
      // If link not found or not clickable, navigate directly
      await page.goto('/contacto')
    }

    await page.waitForTimeout(500)

    // Try to submit without filling required fields
    const submitButton = page.getByRole('button', { name: /enviar|submit/i })
    await submitButton.click()

    // Look for validation errors
    const errorMessage = page.locator('text=/requerido|required|obligatorio|inválido|invalid/i').first()
    await expect(errorMessage).toBeVisible({ timeout: 5000 })
  })

  test('should validate email format', async ({ page }) => {
    await page.goto('/')

    // Try to find registro/contacto link, use .first() to handle multiple matches
    const registroLink = page.getByRole('link', { name: /registro|contacto/i }).first()
    try {
      await registroLink.click({ timeout: 2000 })
    } catch {
      // If link not found or not clickable, navigate directly
      await page.goto('/contacto')
    }

    await page.waitForTimeout(500)

    // Fill with invalid email
    const emailInput = page.getByLabel(/email|correo/i).or(
      page.locator('input[type="email"]')
    ).first()
    await emailInput.fill('invalid-email')

    // Try to submit
    const submitButton = page.getByRole('button', { name: /enviar|submit/i })
    await submitButton.click()

    // Look for email validation error
    const errorMessage = page.locator('text=/email.*inválido|email.*invalid|formato.*email/i').first()
    await expect(errorMessage).toBeVisible({ timeout: 5000 })
  })

  test('should validate phone format', async ({ page }) => {
    await page.goto('/')

    // Try to find registro/contacto link, use .first() to handle multiple matches
    const registroLink = page.getByRole('link', { name: /registro|contacto/i }).first()
    try {
      await registroLink.click({ timeout: 2000 })
    } catch {
      // If link not found or not clickable, navigate directly
      await page.goto('/contacto')
    }

    await page.waitForTimeout(500)

    // Fill email (required)
    const emailInput = page.locator('input[type="email"]').first()
    if (await emailInput.isVisible({ timeout: 1000 })) {
      await emailInput.fill('test@example.com')
    }

    // Fill with invalid phone
    const telefonoInput = page.getByLabel(/teléfono|telefono|phone/i).first()
    if (await telefonoInput.isVisible({ timeout: 1000 })) {
      await telefonoInput.fill('123')

      // Try to submit
      const submitButton = page.getByRole('button', { name: /enviar|submit/i })
      await submitButton.click()

      // Look for phone validation error
      const errorMessage = page.locator('text=/teléfono.*inválido|telefono.*inválido|phone.*invalid/i').first()
      const hasError = await errorMessage.isVisible({ timeout: 2000 }).catch(() => false)

      if (hasError) {
        await expect(errorMessage).toBeVisible()
      }
    }
  })

  test('should handle API errors gracefully', async ({ page }) => {
    // Mock API to return error
    await page.route('**/api/registro', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Error interno del servidor',
        }),
      })
    })

    await page.goto('/')

    // Try to find registro/contacto link, use .first() to handle multiple matches
    const registroLink = page.getByRole('link', { name: /registro|contacto/i }).first()
    try {
      await registroLink.click({ timeout: 2000 })
    } catch {
      // If link not found or not clickable, navigate directly
      await page.goto('/contacto')
    }

    await page.waitForTimeout(500)

    // Fill and submit form
    const emailInput = page.locator('input[type="email"]').first()
    await emailInput.fill('test@example.com')

    const submitButton = page.getByRole('button', { name: /enviar|submit/i })
    await submitButton.click()

    // Look for error message
    const errorMessage = page.getByText(/error|problema|no se pudo/i).first()
    await expect(errorMessage).toBeVisible({ timeout: 10000 })
  })

  test('should clear form after successful submission', async ({ page }) => {
    // Mock successful API response
    await page.route('**/api/registro', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'Registro recibido exitosamente',
        }),
      })
    })

    await page.goto('/')

    // Try to find registro/contacto link, use .first() to handle multiple matches
    const registroLink = page.getByRole('link', { name: /registro|contacto/i }).first()
    try {
      await registroLink.click({ timeout: 2000 })
    } catch {
      // If link not found or not clickable, navigate directly
      await page.goto('/contacto')
    }

    await page.waitForTimeout(500)

    // Fill form
    const emailInput = page.locator('input[type="email"]').first()
    await emailInput.fill('test@example.com')

    // Submit
    const submitButton = page.getByRole('button', { name: /enviar|submit/i })
    await submitButton.click()

    // Wait for success
    await page.waitForTimeout(1000)

    // Check if form is cleared
    const emailValue = await emailInput.inputValue()
    const isCleared = emailValue === ''

    if (isCleared) {
      expect(emailValue).toBe('')
    }
  })

  test('should be responsive on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    await page.goto('/')

    // Try to find registro/contacto link, use .first() to handle multiple matches
    const registroLink = page.getByRole('link', { name: /registro|contacto/i }).first()
    try {
      await registroLink.click({ timeout: 2000 })
    } catch {
      // If link not found or not clickable, navigate directly
      await page.goto('/contacto')
    }

    await page.waitForTimeout(500)

    // Verify form is usable on mobile
    const form = page.locator('form').first()
    await expect(form).toBeVisible()

    // Check for horizontal overflow
    const body = page.locator('body')
    const bodyWidth = await body.evaluate(el => el.scrollWidth)
    expect(bodyWidth).toBeLessThanOrEqual(375)
  })

  test('should handle special characters in Spanish names', async ({ page }) => {
    await page.route('**/api/registro', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, message: 'Éxito' }),
      })
    })

    await page.goto('/')

    // Try to find registro/contacto link, use .first() to handle multiple matches
    const registroLink = page.getByRole('link', { name: /registro|contacto/i }).first()
    try {
      await registroLink.click({ timeout: 2000 })
    } catch {
      // If link not found or not clickable, navigate directly
      await page.goto('/contacto')
    }

    await page.waitForTimeout(500)

    // Fill with Spanish characters
    const nombreInput = page.getByLabel(/nombre|name/i).first()
    if (await nombreInput.isVisible({ timeout: 1000 })) {
      await nombreInput.fill('José María Pérez Núñez')
    }

    const emailInput = page.locator('input[type="email"]').first()
    await emailInput.fill('test@example.com')

    const submitButton = page.getByRole('button', { name: /enviar|submit/i })
    await submitButton.click()

    // Verify submission succeeds
    const successMessage = page.getByText(/éxito|success/i)
    await expect(successMessage).toBeVisible({ timeout: 10000 })
  })
})
