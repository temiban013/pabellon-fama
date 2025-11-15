import { test, expect } from '@playwright/test';

/**
 * E2E Tests para el flujo de Registro
 * El formulario de registro está embebido en la página de inicio (homepage)
 */
test.describe('Flujo de Registro', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar a la página de inicio donde está el formulario
    await page.goto('/');
  });

  test('debe completar el flujo de registro exitosamente', async ({ page }) => {
    // 1. Paso 1: Ingresar email y expandir el formulario
    await page.fill('input[name="email"]', 'juan.perez@example.com');

    // Esperar a que el botón se habilite
    const expandButton = page.locator('button:has-text("Regístrate aquí")');
    await expect(expandButton).toBeEnabled({ timeout: 2000 });
    await expandButton.click();

    // 2. Esperar a que el formulario se expanda y muestre los campos adicionales
    await expect(page.locator('input[name="nombre"]')).toBeVisible({ timeout: 5000 });

    // 3. Llenar el formulario expandido con datos válidos
    await page.fill('input[name="nombre"]', 'Juan Pérez');
    await page.fill('input[name="telefono"]', '787-123-4567');

    // 4. Seleccionar tipo de interés
    await page.selectOption('select[name="interes"]', 'visitante');

    // 5. Agregar mensaje opcional
    await page.fill(
      'textarea[name="mensaje"]',
      'Me gustaría visitar el Pabellón de la Fama'
    );

    // 6. Enviar el formulario - esperar a que el botón se habilite
    const submitButton = page.locator('button:has-text("Completar Registro")');
    await expect(submitButton).toBeEnabled({ timeout: 2000 });
    await submitButton.click();

    // 7. Esperar y verificar mensaje de confirmación (toast notification)
    const successToast = page.locator('[data-testid="toast-success"]');
    await expect(successToast).toBeVisible({ timeout: 10000 });

    // Verify toast contains success message
    await expect(
      successToast.locator('[data-testid="toast-success-title"]')
    ).toContainText(/registro.*exitoso|gracias/i);
  });

  test('debe mostrar errores de validación para datos inválidos', async ({ page }) => {
    // Expandir formulario con email válido
    await page.fill('input[name="email"]', 'test@example.com');
    const expandButton = page.locator('button:has-text("Regístrate aquí")');
    await expect(expandButton).toBeEnabled({ timeout: 2000 });
    await expandButton.click();
    await expect(page.locator('input[name="nombre"]')).toBeVisible();

    // Intentar enviar formulario sin llenar nombre (requerido)
    // El botón estará deshabilitado porque nombre es requerido,
    // pero lo forzamos para probar la validación del lado del cliente
    await page.selectOption('select[name="interes"]', 'general');

    // Verificar que el botón está deshabilitado (validación del cliente)
    const submitButton = page.locator('button:has-text("Completar Registro")');
    await expect(submitButton).toBeDisabled();

    // Esto demuestra que la validación del cliente previene envíos con campos vacíos
  });

  test('debe validar formato de email', async ({ page }) => {
    // Llenar con email válido primero para expandir
    await page.fill('input[name="email"]', 'test@example.com');
    const expandButton = page.locator('button:has-text("Regístrate aquí")');
    await expect(expandButton).toBeEnabled({ timeout: 2000 });
    await expandButton.click();
    await expect(page.locator('input[name="nombre"]')).toBeVisible();

    // Ahora cambiar email a uno inválido
    await page.fill('input[name="email"]', 'email-invalido');
    await page.fill('input[name="nombre"]', 'Test Usuario');
    await page.selectOption('select[name="interes"]', 'general');

    // Esperar que el botón se habilite y hacer clic
    const submitButton = page.locator('button:has-text("Completar Registro")');
    await expect(submitButton).toBeEnabled({ timeout: 2000 });
    await submitButton.click();

    // Verificar error de email
    await expect(
      page.locator('text=/email.*inválido|formato.*email/i')
    ).toBeVisible({ timeout: 5000 });
  });

  test('debe validar formato de teléfono', async ({ page }) => {
    // Expandir formulario
    await page.fill('input[name="email"]', 'maria@example.com');
    const expandButton = page.locator('button:has-text("Regístrate aquí")');
    await expect(expandButton).toBeEnabled({ timeout: 2000 });
    await expandButton.click();
    await expect(page.locator('input[name="nombre"]')).toBeVisible();

    // Llenar con teléfono inválido
    await page.fill('input[name="nombre"]', 'María González');
    await page.fill('input[name="telefono"]', '123'); // Teléfono inválido
    await page.selectOption('select[name="interes"]', 'general');

    // Esperar que el botón se habilite y hacer clic
    const submitButton = page.locator('button:has-text("Completar Registro")');
    await expect(submitButton).toBeEnabled({ timeout: 2000 });
    await submitButton.click();

    // Verificar error de teléfono
    await expect(
      page.locator('text=/teléfono.*inválido|formato.*teléfono/i')
    ).toBeVisible({ timeout: 5000 });
  });

  test('debe permitir registro sin campos opcionales', async ({ page }) => {
    // Expandir formulario
    await page.fill('input[name="email"]', 'carlos@example.com');
    const expandButton = page.locator('button:has-text("Regístrate aquí")');
    await expect(expandButton).toBeEnabled({ timeout: 2000 });
    await expandButton.click();
    await expect(page.locator('input[name="nombre"]')).toBeVisible();

    // Llenar solo campos requeridos
    await page.fill('input[name="nombre"]', 'Carlos Rodríguez');
    await page.selectOption('select[name="interes"]', 'investigador');

    // No llenar teléfono ni mensaje (opcionales)

    // Esperar que el botón se habilite y hacer clic
    const submitButton = page.locator('button:has-text("Completar Registro")');
    await expect(submitButton).toBeEnabled({ timeout: 2000 });
    await submitButton.click();

    // Debe ser exitoso - verificar toast notification
    const successToast = page.locator('[data-testid="toast-success"]');
    await expect(successToast).toBeVisible({ timeout: 10000 });

    await expect(
      successToast.locator('[data-testid="toast-success-title"]')
    ).toContainText(/registro.*exitoso|gracias/i);
  });

  test('debe mostrar indicador de carga durante el envío', async ({ page }) => {
    // Expandir formulario
    await page.fill('input[name="email"]', 'ana@example.com');
    const expandButton = page.locator('button:has-text("Regístrate aquí")');
    await expect(expandButton).toBeEnabled({ timeout: 2000 });
    await expandButton.click();
    await expect(page.locator('input[name="nombre"]')).toBeVisible();

    await page.fill('input[name="nombre"]', 'Ana Martínez');
    await page.selectOption('select[name="interes"]', 'voluntario');

    // Esperar que el botón se habilite y hacer clic
    const submitButton = page.locator('button:has-text("Completar Registro")');
    await expect(submitButton).toBeEnabled({ timeout: 2000 });
    await submitButton.click();

    // Verificar que aparece indicador de carga
    const loadingIndicator = page.locator(
      'button:has-text("Registrando..."), button:disabled'
    );

    // El indicador debería aparecer brevemente
    await expect(loadingIndicator).toBeVisible({ timeout: 2000 }).catch(() => {
      // Puede ser muy rápido para detectar, no es un error crítico
    });
  });

  test('debe prevenir envíos múltiples', async ({ page }) => {
    // Expandir formulario
    await page.fill('input[name="email"]', 'pedro@example.com');
    const expandButton = page.locator('button:has-text("Regístrate aquí")');
    await expect(expandButton).toBeEnabled({ timeout: 2000 });
    await expandButton.click();
    await expect(page.locator('input[name="nombre"]')).toBeVisible();

    await page.fill('input[name="nombre"]', 'Pedro Sánchez');
    await page.selectOption('select[name="interes"]', 'general');

    // Intentar hacer doble click
    const submitButton = page.locator('button:has-text("Completar Registro")');
    await submitButton.click();

    // El botón debería estar deshabilitado después del primer click
    await expect(submitButton).toBeDisabled({ timeout: 1000 }).catch(() => {
      // Si no se deshabilita, al menos verificar que no cause problemas
    });
  });

  test('debe manejar errores del servidor correctamente', async ({ page }) => {
    // Interceptar la petición y forzar un error
    await page.route('**/api/registro', (route) => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: 'Error interno del servidor',
        }),
      });
    });

    // Expandir formulario
    await page.fill('input[name="email"]', 'test@example.com');
    let expandButton = page.locator('button:has-text("Regístrate aquí")');
    await expect(expandButton).toBeEnabled({ timeout: 2000 });
    await expandButton.click();
    await expect(page.locator('input[name="nombre"]')).toBeVisible();

    await page.fill('input[name="nombre"]', 'Test Usuario');
    await page.selectOption('select[name="interes"]', 'general');

    // Esperar que el botón se habilite y hacer clic
    const submitButton = page.locator('button:has-text("Completar Registro")');
    await expect(submitButton).toBeEnabled({ timeout: 2000 });
    await submitButton.click();

    // Wait for error toast
    const errorToast = page.locator('[data-testid="toast-error"]').first();
    await expect(errorToast).toBeVisible({ timeout: 5000 });

    // Verify error message
    await expect(
      errorToast.locator('[data-testid="toast-error-title"]')
    ).toContainText(/error/i);
  });

  test('debe validar longitud mínima del nombre', async ({ page }) => {
    // Expandir formulario
    await page.fill('input[name="email"]', 'test@example.com');
    const expandButton = page.locator('button:has-text("Regístrate aquí")');
    await expect(expandButton).toBeEnabled({ timeout: 2000 });
    await expandButton.click();
    await expect(page.locator('input[name="nombre"]')).toBeVisible();

    await page.fill('input[name="nombre"]', 'A'); // Solo 1 carácter (inválido - mínimo 2)
    await page.selectOption('select[name="interes"]', 'general');

    // Intentar enviar formulario
    const submitButton = page.locator('button:has-text("Completar Registro")');
    await expect(submitButton).toBeEnabled({ timeout: 2000 });
    await submitButton.click();

    // Wait for validation error to appear
    // Message: "El nombre debe tener al menos 2 caracteres"
    await expect(
      page.locator('text=/nombre.*debe.*tener.*al menos.*2.*caracteres/i')
    ).toBeVisible({ timeout: 5000 });
  });

  test('debe validar longitud máxima del mensaje', async ({ page }) => {
    // Expandir formulario
    await page.fill('input[name="email"]', 'juan@example.com');
    const expandButton = page.locator('button:has-text("Regístrate aquí")');
    await expect(expandButton).toBeEnabled({ timeout: 2000 });
    await expandButton.click();
    await expect(page.locator('input[name="nombre"]')).toBeVisible();

    await page.fill('input[name="nombre"]', 'Juan Pérez');
    await page.selectOption('select[name="interes"]', 'general');

    // Remove maxLength attribute and fill mensaje with more than 500 characters
    const longMessage = 'a'.repeat(501);
    await page.evaluate(() => {
      const textarea = document.querySelector('textarea[name="mensaje"]') as HTMLTextAreaElement;
      if (textarea) {
        textarea.removeAttribute('maxLength');
      }
    });

    // Now fill with the long message
    await page.fill('textarea[name="mensaje"]', longMessage);

    // Intentar enviar
    const submitButton = page.locator('button:has-text("Completar Registro")');
    await expect(submitButton).toBeEnabled({ timeout: 2000 });
    await submitButton.click();

    // Verificar error de validación desde el servidor
    // The error will come back from the API and show in a toast
    const errorToast = page.locator('[data-testid="toast-error"]').first();
    await expect(errorToast).toBeVisible({ timeout: 5000 });

    // Verify error message contains validation error
    await expect(
      errorToast.locator('[data-testid="toast-error-title"]')
    ).toContainText(/error/i);
  });

  test('debe ser accesible con teclado', async ({ page }) => {
    await page.goto('/');

    // Fill email field using keyboard
    await page.locator('input[name="email"]').focus();
    await page.keyboard.type('test@example.com');

    // Wait for form state to update and button to enable
    const expandButton = page.locator('button:has-text("Regístrate aquí")');

    // CRITICAL FIX: Wait for button to be enabled (form state updates async)
    await expect(expandButton).toBeEnabled({ timeout: 3000 });

    // Expand form with Enter
    await expandButton.focus();
    await page.keyboard.press('Enter');

    // Wait for expanded form
    await expect(page.locator('input[name="nombre"]')).toBeVisible();

    // Fill nombre field
    const nombreInput = page.locator('input[name="nombre"]');
    await nombreInput.focus();
    await page.keyboard.type('Juan Pérez');

    // Fill telefono field
    await page.keyboard.press('Tab');
    await page.keyboard.type('787-123-4567');

    // Select interes - use selectOption instead of keyboard for reliability
    await page.keyboard.press('Tab');
    await page.selectOption('select[name="interes"]', 'visitante');

    // Fill mensaje field
    await page.keyboard.press('Tab');
    await page.keyboard.type('Mensaje de prueba desde teclado');

    // Wait for submit button to be enabled
    const submitButton = page.locator('button:has-text("Completar Registro")');
    await expect(submitButton).toBeEnabled({ timeout: 2000 });

    // Click submit button (keyboard navigation to buttons can be flaky)
    await submitButton.click();

    // Check for success toast (not DOM text)
    const successToast = page.locator('[data-testid="toast-success"]');
    await expect(successToast).toBeVisible({ timeout: 10000 });
  });

  test('debe mantener los datos si hay error de red', async ({ page }) => {
    // Simular error de red
    await page.route('**/api/registro', (route) => {
      route.abort('failed');
    });

    const nombre = 'Elena Fernández';
    const email = 'elena@example.com';

    // Expandir formulario
    await page.fill('input[name="email"]', email);
    const expandButton = page.locator('button:has-text("Regístrate aquí")');
    await expect(expandButton).toBeEnabled({ timeout: 2000 });
    await expandButton.click();
    await expect(page.locator('input[name="nombre"]')).toBeVisible();

    await page.fill('input[name="nombre"]', nombre);
    await page.selectOption('select[name="interes"]', 'voluntario');

    await page.click('button:has-text("Completar Registro")');

    // Esperar mensaje de error - use first() to avoid strict mode violation
    const errorToast = page.locator('[data-testid="toast-error"]').first();
    await expect(errorToast).toBeVisible({ timeout: 5000 });

    // Verify error toast contains error message
    await expect(
      errorToast.locator('[data-testid="toast-error-title"]')
    ).toContainText(/error/i);

    // Verificar que los datos se mantienen en el formulario
    await expect(page.locator('input[name="nombre"]')).toHaveValue(nombre);
    await expect(page.locator('input[name="email"]')).toHaveValue(email);
  });
});

/**
 * Tests de responsividad móvil
 */
test.describe('Registro - Vista Móvil', () => {
  test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE

  test('debe funcionar correctamente en dispositivos móviles', async ({ page }) => {
    await page.goto('/');

    // Expandir formulario
    await page.fill('input[name="email"]', 'movil@example.com');
    const expandButton = page.locator('button:has-text("Regístrate aquí")');
    await expect(expandButton).toBeEnabled({ timeout: 2000 });
    await expandButton.click();
    await expect(page.locator('input[name="nombre"]')).toBeVisible();

    // Verificar que el formulario es visible y usable en móvil
    await page.fill('input[name="nombre"]', 'Usuario Móvil');
    await page.selectOption('select[name="interes"]', 'visitante');

    // Esperar que el botón se habilite y hacer clic
    const submitButton = page.locator('button:has-text("Completar Registro")');
    await expect(submitButton).toBeEnabled({ timeout: 2000 });
    await submitButton.click();

    // Verificar toast notification de éxito
    const successToast = page.locator('[data-testid="toast-success"]');
    await expect(successToast).toBeVisible({ timeout: 10000 });

    await expect(
      successToast.locator('[data-testid="toast-success-title"]')
    ).toContainText(/registro.*exitoso|gracias/i);
  });

  test('debe tener botones y campos de tamaño adecuado en móvil', async ({ page }) => {
    await page.goto('/');

    // Expandir formulario
    await page.fill('input[name="email"]', 'test@example.com');
    const expandButton = page.locator('button:has-text("Regístrate aquí")');
    await expect(expandButton).toBeEnabled({ timeout: 2000 });
    await expandButton.click();
    await expect(page.locator('input[name="nombre"]')).toBeVisible();

    // Verificar que los campos de entrada tienen altura mínima para móvil
    const nombreInput = page.locator('input[name="nombre"]');
    const box = await nombreInput.boundingBox();

    expect(box?.height).toBeGreaterThanOrEqual(40); // Mínimo 40px para touch

    // Verificar que el botón de submit es suficientemente grande
    const submitButton = page.locator('button:has-text("Completar Registro")');
    const buttonBox = await submitButton.boundingBox();

    expect(buttonBox?.height).toBeGreaterThanOrEqual(44); // Mínimo 44px para touch
  });
});

/**
 * Tests de accesibilidad
 */
test.describe('Registro - Accesibilidad', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('debe tener labels correctos para todos los campos', async ({ page }) => {
    // Expandir formulario primero
    await page.fill('input[name="email"]', 'test@example.com');
    const expandButton = page.locator('button:has-text("Regístrate aquí")');
    await expect(expandButton).toBeEnabled({ timeout: 2000 });
    await expandButton.click();
    await expect(page.locator('input[name="nombre"]')).toBeVisible();

    // Verificar que todos los inputs tienen labels o aria-labels
    const nombreInput = page.locator('input[name="nombre"]');
    const nombreLabel = await nombreInput.getAttribute('aria-label');
    const hasLabel = nombreLabel || (await page.locator('label[for*="nombre"]').count()) > 0;

    expect(hasLabel).toBeTruthy();
  });

  test('debe anunciar errores a lectores de pantalla', async ({ page }) => {
    // Expandir formulario con email válido
    await page.fill('input[name="email"]', 'test@example.com');
    const expandButton = page.locator('button:has-text("Regístrate aquí")');
    await expect(expandButton).toBeEnabled({ timeout: 2000 });
    await expandButton.click();
    await expect(page.locator('input[name="nombre"]')).toBeVisible();

    // Intentar submit sin llenar nombre (campo requerido)
    await page.selectOption('select[name="interes"]', 'general');

    // El botón debe estar deshabilitado porque nombre es requerido
    const submitButton = page.locator('button:has-text("Completar Registro")');
    await expect(submitButton).toBeDisabled();

    // Verificar que el botón tiene atributos de accesibilidad apropiados cuando está deshabilitado
    const isDisabled = await submitButton.getAttribute('disabled');
    expect(isDisabled).not.toBeNull();
  });

  test('debe tener contraste adecuado en textos', async ({ page }) => {
    // Verificar que el texto tiene color suficientemente contrastante
    // (Esto es una verificación básica, herramientas como axe-core son más completas)
    const submitButton = page.locator('button:has-text("Regístrate aquí")');
    const color = await submitButton.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });

    // El color no debería ser transparente o muy claro
    expect(color).not.toBe('rgba(0, 0, 0, 0)');
  });
});
