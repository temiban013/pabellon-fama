import { defineConfig, devices } from '@playwright/test';

/**
 * Configuración de Playwright para pruebas E2E
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests/e2e',

  /* Tiempo máximo por prueba */
  timeout: 30 * 1000,

  /* Configuración de expect */
  expect: {
    timeout: 5000,
  },

  /* Ejecutar pruebas en paralelo */
  fullyParallel: true,

  /* Fallar el build en CI si dejaste test.only en el código */
  forbidOnly: !!process.env.CI,

  /* Reintentos en CI, ninguno localmente */
  retries: process.env.CI ? 2 : 0,

  /* Número de workers */
  workers: process.env.CI ? 1 : undefined,

  /* Reporter a usar */
  reporter: [
    ['html'],
    ['list'],
    process.env.CI ? ['github'] : ['list'],
  ],

  /* Configuración compartida para todos los proyectos */
  use: {
    /* URL base para usar en acciones como `await page.goto('/')` */
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000',

    /* Recolectar trazas en el primer reintento de una prueba fallida */
    trace: 'on-first-retry',

    /* Captura de pantalla en fallas */
    screenshot: 'only-on-failure',

    /* Video en fallas */
    video: 'retain-on-failure',

    /* Locale en español */
    locale: 'es-DO',

    /* Zona horaria */
    timezoneId: 'America/Santo_Domingo',
  },

  /* Configuración de proyectos para diferentes navegadores */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Pruebas en móviles */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  /* Servidor de desarrollo para pruebas E2E */
  webServer: {
    command: 'pnpm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
