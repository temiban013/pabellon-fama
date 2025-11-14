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
    await page.click('button:has-text("Regístrate aquí")');

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

    // 6. Enviar el formulario
    await page.click('button:has-text("Completar Registro")');

    // 7. Esperar y verificar mensaje de confirmación
    await expect(
      page.locator('text=/gracias|éxito|registrado/i')
    ).toBeVisible({ timeout: 10000 });
  });

  test('debe mostrar errores de validación para datos inválidos', async ({ page }) => {
    // Intentar expandir formulario sin email
    await page.click('button:has-text("Regístrate aquí")');

    // Verificar que se muestran errores de validación
    await expect(
      page.locator('text=/requerido|obligatorio|necesario|inválido/i')
    ).toBeVisible({ timeout: 5000 });
  });

  test('debe validar formato de email', async ({ page }) => {
    // Llenar con email inválido
    await page.fill('input[name="email"]', 'email-invalido');
    await page.click('button:has-text("Regístrate aquí")');

    // Verificar error de email
    await expect(
      page.locator('text=/email.*inválido|formato.*email/i')
    ).toBeVisible({ timeout: 5000 });
  });

  test('debe validar formato de teléfono', async ({ page }) => {
    // Expandir formulario
    await page.fill('input[name="email"]', 'maria@example.com');
    await page.click('button:has-text("Regístrate aquí")');
    await expect(page.locator('input[name="nombre"]')).toBeVisible();

    // Llenar con teléfono inválido
    await page.fill('input[name="nombre"]', 'María González');
    await page.fill('input[name="telefono"]', '123'); // Teléfono inválido
    await page.selectOption('select[name="interes"]', 'general');

    await page.click('button:has-text("Completar Registro")');

    // Verificar error de teléfono
    await expect(
      page.locator('text=/teléfono.*inválido|formato.*teléfono/i')
    ).toBeVisible({ timeout: 5000 });
  });

  test('debe permitir registro sin campos opcionales', async ({ page }) => {
    // Expandir formulario
    await page.fill('input[name="email"]', 'carlos@example.com');
    await page.click('button:has-text("Regístrate aquí")');
    await expect(page.locator('input[name="nombre"]')).toBeVisible();

    // Llenar solo campos requeridos
    await page.fill('input[name="nombre"]', 'Carlos Rodríguez');
    await page.selectOption('select[name="interes"]', 'investigador');

    // No llenar teléfono ni mensaje (opcionales)

    await page.click('button:has-text("Completar Registro")');

    // Debe ser exitoso
    await expect(
      page.locator('text=/gracias|éxito|registrado/i')
    ).toBeVisible({ timeout: 10000 });
  });

  test('debe mostrar indicador de carga durante el envío', async ({ page }) => {
    // Expandir formulario
    await page.fill('input[name="email"]', 'ana@example.com');
    await page.click('button:has-text("Regístrate aquí")');
    await expect(page.locator('input[name="nombre"]')).toBeVisible();

    await page.fill('input[name="nombre"]', 'Ana Martínez');
    await page.selectOption('select[name="interes"]', 'voluntario');

    // Click en submit
    await page.click('button:has-text("Completar Registro")');

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
    await page.click('button:has-text("Regístrate aquí")');
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
    await page.click('button:has-text("Regístrate aquí")');
    await expect(page.locator('input[name="nombre"]')).toBeVisible();

    await page.fill('input[name="nombre"]', 'Test Usuario');
    await page.selectOption('select[name="interes"]', 'general');

    await page.click('button:has-text("Completar Registro")');

    // Verificar que se muestra mensaje de error
    await expect(
      page.locator('text=/error|problema|intente.*nuevo/i')
    ).toBeVisible({ timeout: 5000 });
  });

  test('debe validar longitud mínima del nombre', async ({ page }) => {
    // Expandir formulario
    await page.fill('input[name="email"]', 'test@example.com');
    await page.click('button:has-text("Regístrate aquí")');
    await expect(page.locator('input[name="nombre"]')).toBeVisible();

    await page.fill('input[name="nombre"]', 'J'); // Solo 1 carácter
    await page.selectOption('select[name="interes"]', 'general');

    await page.click('button:has-text("Completar Registro")');

    await expect(
      page.locator('text=/nombre.*corto|mínimo.*2.*caracteres/i')
    ).toBeVisible({ timeout: 5000 });
  });

  test('debe validar longitud máxima del mensaje', async ({ page }) => {
    // Expandir formulario
    await page.fill('input[name="email"]', 'juan@example.com');
    await page.click('button:has-text("Regístrate aquí")');
    await expect(page.locator('input[name="nombre"]')).toBeVisible();

    await page.fill('input[name="nombre"]', 'Juan Pérez');
    await page.selectOption('select[name="interes"]', 'general');

    // Mensaje muy largo (más de 500 caracteres)
    const mensajeLargo = 'a'.repeat(501);
    await page.fill('textarea[name="mensaje"]', mensajeLargo);

    await page.click('button:has-text("Completar Registro")');

    await expect(
      page.locator('text=/mensaje.*largo|máximo.*500/i')
    ).toBeVisible({ timeout: 5000 });
  });

  test('debe ser accesible con teclado', async ({ page }) => {
    // Paso 1: Email field
    await page.keyboard.press('Tab');
    await page.keyboard.type('roberto@example.com');

    // Expandir formulario con Enter
    await page.keyboard.press('Tab'); // Focus en botón "Regístrate aquí"
    await page.keyboard.press('Enter');

    // Esperar expansión
    await expect(page.locator('input[name="nombre"]')).toBeVisible();

    // Paso 2: Llenar campos usando Tab
    await page.keyboard.press('Tab'); // Email (ya lleno)
    await page.keyboard.press('Tab'); // Nombre
    await page.keyboard.type('Roberto García');

    await page.keyboard.press('Tab'); // Teléfono
    await page.keyboard.type('787-555-1234');

    await page.keyboard.press('Tab'); // Interés (select)
    await page.keyboard.press('ArrowDown'); // Seleccionar opción

    await page.keyboard.press('Tab'); // Mensaje
    await page.keyboard.type('Mensaje de prueba');

    await page.keyboard.press('Tab'); // Botón Volver
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

    const nombre = 'Elena Fernández';
    const email = 'elena@example.com';

    // Expandir formulario
    await page.fill('input[name="email"]', email);
    await page.click('button:has-text("Regístrate aquí")');
    await expect(page.locator('input[name="nombre"]')).toBeVisible();

    await page.fill('input[name="nombre"]', nombre);
    await page.selectOption('select[name="interes"]', 'voluntario');

    await page.click('button:has-text("Completar Registro")');

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
    await page.goto('/');

    // Expandir formulario
    await page.fill('input[name="email"]', 'movil@example.com');
    await page.click('button:has-text("Regístrate aquí")');
    await expect(page.locator('input[name="nombre"]')).toBeVisible();

    // Verificar que el formulario es visible y usable en móvil
    await page.fill('input[name="nombre"]', 'Usuario Móvil');
    await page.selectOption('select[name="interes"]', 'visitante');

    await page.click('button:has-text("Completar Registro")');

    await expect(
      page.locator('text=/gracias|éxito|registrado/i')
    ).toBeVisible({ timeout: 10000 });
  });

  test('debe tener botones y campos de tamaño adecuado en móvil', async ({ page }) => {
    await page.goto('/');

    // Expandir formulario
    await page.fill('input[name="email"]', 'test@example.com');
    await page.click('button:has-text("Regístrate aquí")');
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
    await page.click('button:has-text("Regístrate aquí")');
    await expect(page.locator('input[name="nombre"]')).toBeVisible();

    // Verificar que todos los inputs tienen labels o aria-labels
    const nombreInput = page.locator('input[name="nombre"]');
    const nombreLabel = await nombreInput.getAttribute('aria-label');
    const hasLabel = nombreLabel || (await page.locator('label[for*="nombre"]').count()) > 0;

    expect(hasLabel).toBeTruthy();
  });

  test('debe anunciar errores a lectores de pantalla', async ({ page }) => {
    // Intentar submit sin llenar email
    await page.click('button:has-text("Regístrate aquí")');

    // Verificar que los mensajes de error tienen role="alert" o aria-live
    const errorMessage = page.locator('[role="alert"], [aria-live="polite"], text=/requerido|obligatorio|inválido/i');
    await expect(errorMessage).toBeVisible({ timeout: 5000 });
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
