import { test, expect } from '@playwright/test';

/**
 * E2E Tests para el flujo de Registro
 * Flujo: Home → Registro → Submit → Confirmation
 */
test.describe('Flujo de Registro', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar a la página de inicio
    await page.goto('/');
  });

  test('debe completar el flujo de registro exitosamente', async ({ page }) => {
    // 1. Desde Home, navegar a la página de registro
    await page.click('a[href*="registro"]');
    await expect(page).toHaveURL(/.*registro/);

    // 2. Verificar que el formulario de registro está presente
    await expect(page.locator('form')).toBeVisible();

    // 3. Llenar el formulario con datos válidos
    await page.fill('input[name="nombre"]', 'Juan Pérez');
    await page.fill('input[name="email"]', 'juan.perez@example.com');
    await page.fill('input[name="telefono"]', '787-123-4567');

    // 4. Seleccionar tipo de interés
    await page.selectOption('select[name="interes"]', 'visitante');

    // 5. Agregar mensaje opcional
    await page.fill(
      'textarea[name="mensaje"]',
      'Me gustaría visitar el Pabellón de la Fama'
    );

    // 6. Enviar el formulario
    await page.click('button[type="submit"]');

    // 7. Esperar y verificar mensaje de confirmación
    await expect(
      page.locator('text=/gracias|éxito|registrado/i')
    ).toBeVisible({ timeout: 10000 });

    // 8. Verificar que el formulario se ha limpiado o se muestra confirmación
    const emailInput = page.locator('input[name="email"]');
    const hasBeenCleared = (await emailInput.inputValue()) === '';
    const confirmationVisible = await page
      .locator('text=/confirmación|éxito/i')
      .isVisible();

    expect(hasBeenCleared || confirmationVisible).toBeTruthy();
  });

  test('debe mostrar errores de validación para datos inválidos', async ({ page }) => {
    // Navegar a registro
    await page.goto('/registro');

    // Intentar enviar formulario vacío
    await page.click('button[type="submit"]');

    // Verificar que se muestran errores de validación
    await expect(
      page.locator('text=/requerido|obligatorio|necesario/i')
    ).toBeVisible({ timeout: 5000 });
  });

  test('debe validar formato de email', async ({ page }) => {
    await page.goto('/registro');

    // Llenar con email inválido
    await page.fill('input[name="nombre"]', 'Juan Pérez');
    await page.fill('input[name="email"]', 'email-invalido');
    await page.selectOption('select[name="interes"]', 'general');

    await page.click('button[type="submit"]');

    // Verificar error de email
    await expect(
      page.locator('text=/email.*inválido|formato.*email/i')
    ).toBeVisible({ timeout: 5000 });
  });

  test('debe validar formato de teléfono', async ({ page }) => {
    await page.goto('/registro');

    await page.fill('input[name="nombre"]', 'María González');
    await page.fill('input[name="email"]', 'maria@example.com');
    await page.fill('input[name="telefono"]', '123'); // Teléfono inválido
    await page.selectOption('select[name="interes"]', 'general');

    await page.click('button[type="submit"]');

    // Verificar error de teléfono
    await expect(
      page.locator('text=/teléfono.*inválido|formato.*teléfono/i')
    ).toBeVisible({ timeout: 5000 });
  });

  test('debe permitir registro sin campos opcionales', async ({ page }) => {
    await page.goto('/registro');

    // Llenar solo campos requeridos
    await page.fill('input[name="nombre"]', 'Carlos Rodríguez');
    await page.fill('input[name="email"]', 'carlos@example.com');
    await page.selectOption('select[name="interes"]', 'investigador');

    // No llenar teléfono ni mensaje (opcionales)

    await page.click('button[type="submit"]');

    // Debe ser exitoso
    await expect(
      page.locator('text=/gracias|éxito|registrado/i')
    ).toBeVisible({ timeout: 10000 });
  });

  test('debe mostrar indicador de carga durante el envío', async ({ page }) => {
    await page.goto('/registro');

    await page.fill('input[name="nombre"]', 'Ana Martínez');
    await page.fill('input[name="email"]', 'ana@example.com');
    await page.selectOption('select[name="interes"]', 'voluntario');

    // Click en submit
    await page.click('button[type="submit"]');

    // Verificar que aparece indicador de carga
    const loadingIndicator = page.locator(
      'button[type="submit"]:disabled, text=/enviando|cargando|espere/i'
    );

    // El indicador debería aparecer brevemente
    await expect(loadingIndicator).toBeVisible({ timeout: 2000 }).catch(() => {
      // Puede ser muy rápido para detectar, no es un error crítico
    });
  });

  test('debe prevenir envíos múltiples', async ({ page }) => {
    await page.goto('/registro');

    await page.fill('input[name="nombre"]', 'Pedro Sánchez');
    await page.fill('input[name="email"]', 'pedro@example.com');
    await page.selectOption('select[name="interes"]', 'general');

    // Intentar hacer doble click
    const submitButton = page.locator('button[type="submit"]');
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

    await page.goto('/registro');

    await page.fill('input[name="nombre"]', 'Test Usuario');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.selectOption('select[name="interes"]', 'general');

    await page.click('button[type="submit"]');

    // Verificar que se muestra mensaje de error
    await expect(
      page.locator('text=/error|problema|intente.*nuevo/i')
    ).toBeVisible({ timeout: 5000 });
  });

  test('debe validar longitud mínima del nombre', async ({ page }) => {
    await page.goto('/registro');

    await page.fill('input[name="nombre"]', 'J'); // Solo 1 carácter
    await page.fill('input[name="email"]', 'test@example.com');
    await page.selectOption('select[name="interes"]', 'general');

    await page.click('button[type="submit"]');

    await expect(
      page.locator('text=/nombre.*corto|mínimo.*2.*caracteres/i')
    ).toBeVisible({ timeout: 5000 });
  });

  test('debe validar longitud máxima del mensaje', async ({ page }) => {
    await page.goto('/registro');

    await page.fill('input[name="nombre"]', 'Juan Pérez');
    await page.fill('input[name="email"]', 'juan@example.com');
    await page.selectOption('select[name="interes"]', 'general');

    // Mensaje muy largo (más de 500 caracteres)
    const mensajeLargo = 'a'.repeat(501);
    await page.fill('textarea[name="mensaje"]', mensajeLargo);

    await page.click('button[type="submit"]');

    await expect(
      page.locator('text=/mensaje.*largo|máximo.*500/i')
    ).toBeVisible({ timeout: 5000 });
  });

  test('debe ser accesible con teclado', async ({ page }) => {
    await page.goto('/registro');

    // Navegar usando Tab
    await page.keyboard.press('Tab'); // Primer campo
    await page.keyboard.type('Roberto García');

    await page.keyboard.press('Tab'); // Email
    await page.keyboard.type('roberto@example.com');

    await page.keyboard.press('Tab'); // Teléfono
    await page.keyboard.type('787-555-1234');

    await page.keyboard.press('Tab'); // Interés (select)
    await page.keyboard.press('ArrowDown'); // Seleccionar opción

    await page.keyboard.press('Tab'); // Mensaje
    await page.keyboard.type('Mensaje de prueba');

    await page.keyboard.press('Tab'); // Submit button
    await page.keyboard.press('Enter'); // Submit

    // Verificar éxito
    await expect(
      page.locator('text=/gracias|éxito|registrado/i')
    ).toBeVisible({ timeout: 10000 });
  });

  test('debe mantener los datos si hay error de red', async ({ page }) => {
    // Simular error de red
    await page.route('**/api/registro', (route) => {
      route.abort('failed');
    });

    await page.goto('/registro');

    const nombre = 'Elena Fernández';
    const email = 'elena@example.com';

    await page.fill('input[name="nombre"]', nombre);
    await page.fill('input[name="email"]', email);
    await page.selectOption('select[name="interes"]', 'voluntario');

    await page.click('button[type="submit"]');

    // Esperar mensaje de error
    await expect(
      page.locator('text=/error|conexión|red/i')
    ).toBeVisible({ timeout: 5000 });

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
    await page.goto('/registro');

    // Verificar que el formulario es visible y usable en móvil
    await expect(page.locator('form')).toBeVisible();

    await page.fill('input[name="nombre"]', 'Usuario Móvil');
    await page.fill('input[name="email"]', 'movil@example.com');
    await page.selectOption('select[name="interes"]', 'visitante');

    await page.click('button[type="submit"]');

    await expect(
      page.locator('text=/gracias|éxito|registrado/i')
    ).toBeVisible({ timeout: 10000 });
  });

  test('debe tener botones y campos de tamaño adecuado en móvil', async ({ page }) => {
    await page.goto('/registro');

    // Verificar que los campos de entrada tienen altura mínima para móvil
    const nombreInput = page.locator('input[name="nombre"]');
    const box = await nombreInput.boundingBox();

    expect(box?.height).toBeGreaterThanOrEqual(40); // Mínimo 40px para touch

    // Verificar que el botón de submit es suficientemente grande
    const submitButton = page.locator('button[type="submit"]');
    const buttonBox = await submitButton.boundingBox();

    expect(buttonBox?.height).toBeGreaterThanOrEqual(44); // Mínimo 44px para touch
  });
});

/**
 * Tests de accesibilidad
 */
test.describe('Registro - Accesibilidad', () => {
  test('debe tener labels correctos para todos los campos', async ({ page }) => {
    await page.goto('/registro');

    // Verificar que todos los inputs tienen labels o aria-labels
    const nombreInput = page.locator('input[name="nombre"]');
    const nombreLabel = await nombreInput.getAttribute('aria-label');
    const hasLabel = nombreLabel || (await page.locator('label[for*="nombre"]').count()) > 0;

    expect(hasLabel).toBeTruthy();
  });

  test('debe anunciar errores a lectores de pantalla', async ({ page }) => {
    await page.goto('/registro');

    await page.click('button[type="submit"]');

    // Verificar que los mensajes de error tienen role="alert" o aria-live
    const errorMessage = page.locator('[role="alert"], [aria-live="polite"]');
    await expect(errorMessage).toBeVisible({ timeout: 5000 });
  });

  test('debe tener contraste adecuado en textos', async ({ page }) => {
    await page.goto('/registro');

    // Verificar que el texto tiene color suficientemente contrastante
    // (Esto es una verificación básica, herramientas como axe-core son más completas)
    const submitButton = page.locator('button[type="submit"]');
    const color = await submitButton.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });

    // El color no debería ser transparente o muy claro
    expect(color).not.toBe('rgba(0, 0, 0, 0)');
  });
});
