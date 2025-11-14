# Testing Documentation - Pabellón de la Fama del Deporte Humacaeño

Documentación completa para el suite de pruebas del PFDH.

## Tabla de Contenidos

- [Instalación](#instalación)
- [Stack de Testing](#stack-de-testing)
- [Estructura de Tests](#estructura-de-tests)
- [Ejecutar Tests](#ejecutar-tests)
- [Escribir Tests](#escribir-tests)
- [Cobertura de Tests](#cobertura-de-tests)
- [CI/CD](#cicd)
- [Solución de Problemas](#solución-de-problemas)

---

## Instalación

### 1. Instalar Dependencias de Testing

```bash
# Instalar todas las dependencias de testing
pnpm add -D vitest @vitest/ui @vitest/coverage-v8 @vitejs/plugin-react jsdom
pnpm add -D @testing-library/react @testing-library/jest-dom @testing-library/user-event
pnpm add -D msw @playwright/test
```

### 2. Instalar Navegadores de Playwright

```bash
# Instalar navegadores para pruebas E2E
pnpm playwright:install
```

### 3. Verificar Instalación

```bash
# Ejecutar tests unitarios
pnpm test:run

# Ejecutar tests E2E
pnpm test:e2e
```

---

## Stack de Testing

### Unit & Integration Tests

- **Vitest** - Test runner rápido con soporte nativo para ESM y TypeScript
- **@testing-library/react** - Testing de componentes React
- **@testing-library/jest-dom** - Matchers personalizados para el DOM
- **@testing-library/user-event** - Simulación avanzada de interacciones de usuario

### E2E Tests

- **Playwright** - Framework moderno para pruebas end-to-end
  - Soporte para Chromium, Firefox, y WebKit
  - Ejecución paralela de tests
  - Screenshots y videos automáticos en fallos

### API Mocking

- **MSW (Mock Service Worker)** - Interceptación de requests HTTP para testing

---

## Estructura de Tests

```
tests/
├── setup/                    # Configuración de testing
│   ├── vitest.setup.ts      # Setup global de Vitest
│   ├── test-utils.tsx       # Utilidades y custom render
│   ├── msw-server.ts        # Servidor MSW
│   └── msw-handlers.ts      # Handlers de API mockeados
├── fixtures/                 # Datos de prueba
│   └── mock-data.ts         # Factory de datos en español
├── unit/                     # Tests unitarios
│   ├── components/          # Tests de componentes
│   ├── lib/                 # Tests de utilidades y librerías
│   ├── hooks/               # Tests de custom hooks
│   └── utils/               # Tests de funciones helper
├── integration/              # Tests de integración
│   └── api/                 # Tests de rutas API
└── e2e/                      # Tests end-to-end
    └── flows/               # Flujos de usuario completos
```

---

## Ejecutar Tests

### Tests Unitarios y de Integración

```bash
# Modo watch (recomendado para desarrollo)
pnpm test

# Ejecutar todos los tests una vez
pnpm test:run

# Ejecutar con UI interactiva
pnpm test:ui

# Ejecutar tests específicos
pnpm test validations

# Ejecutar con cobertura
pnpm test:coverage
```

### Tests E2E

```bash
# Ejecutar todos los tests E2E
pnpm test:e2e

# Ejecutar con UI de Playwright
pnpm test:e2e:ui

# Ejecutar en modo headed (ver navegador)
pnpm test:e2e:headed

# Ejecutar en modo debug
pnpm test:e2e:debug

# Ejecutar tests específicos
pnpm test:e2e registro

# Ejecutar en navegador específico
pnpm test:e2e --project=chromium
pnpm test:e2e --project=firefox
pnpm test:e2e --project=webkit
```

### Tests Completos

```bash
# Ejecutar todos los tests (unit + integration + E2E)
pnpm test:all
```

---

## Escribir Tests

### Unit Tests - Componentes

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '../../setup/test-utils';
import { ExaltadoCard } from '@/components/directorio/ExaltadoCard';
import { createMockExaltado } from '../../fixtures/mock-data';

describe('ExaltadoCard', () => {
  it('renderiza el nombre del exaltado correctamente', () => {
    const exaltado = createMockExaltado({
      nombre: 'Juan',
      apellidos: 'Pérez',
    });

    render(<ExaltadoCard exaltado={exaltado} viewMode="grid" />);

    expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
  });
});
```

### Unit Tests - Funciones

```typescript
import { describe, it, expect } from 'vitest';
import { validateRegistro } from '@/lib/validations';

describe('validations', () => {
  it('valida email correctamente', () => {
    const data = {
      email: 'test@example.com',
      interes: 'general',
    };

    const result = validateRegistro(data);
    expect(result.success).toBe(true);
  });
});
```

### Integration Tests - API Routes

```typescript
import { describe, it, expect } from 'vitest';
import { POST } from '@/app/api/registro/route';
import { NextRequest } from 'next/server';

describe('POST /api/registro', () => {
  it('acepta un registro válido', async () => {
    const request = new NextRequest('http://localhost:3000/api/registro', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        nombre: 'Juan Pérez',
        email: 'juan@example.com',
        interes: 'general',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
  });
});
```

### E2E Tests

```typescript
import { test, expect } from '@playwright/test';

test('flujo de registro completo', async ({ page }) => {
  await page.goto('/registro');

  await page.fill('input[name="nombre"]', 'Juan Pérez');
  await page.fill('input[name="email"]', 'juan@example.com');
  await page.selectOption('select[name="interes"]', 'visitante');

  await page.click('button[type="submit"]');

  await expect(page.locator('text=/éxito|gracias/i')).toBeVisible();
});
```

---

## Cobertura de Tests

### Objetivo de Cobertura

- **Lines:** 80%+
- **Statements:** 80%+
- **Functions:** 80%+
- **Branches:** 80%+

### Generar Reporte de Cobertura

```bash
# Generar reporte de cobertura
pnpm test:coverage

# Ver reporte HTML (se abre automáticamente)
open coverage/index.html
```

### Archivos Excluidos de Cobertura

- `node_modules/`
- `tests/`
- Archivos de configuración (`*.config.ts`)
- `.next/` y `out/`
- Layouts, error pages, loading pages de Next.js
- Archivos de tipos TypeScript (`*.d.ts`, `types.ts`)

---

## CI/CD

### GitHub Actions

El workflow de tests se ejecuta automáticamente en:

- **Push** a branches: `main`, `develop`, `claude/**`
- **Pull Requests** hacia: `main`, `develop`

### Jobs del Workflow

1. **unit-and-integration-tests**
   - Ejecuta tests unitarios y de integración
   - Genera reporte de cobertura
   - Verifica umbrales de cobertura
   - Sube artefactos de cobertura

2. **e2e-tests**
   - Build de la aplicación
   - Ejecuta tests E2E en Chromium
   - Sube reportes y videos en caso de fallo

3. **lint**
   - Ejecuta ESLint

4. **type-check**
   - Verifica tipos con TypeScript

5. **summary**
   - Genera resumen de todos los tests
   - Falla el build si algún test falla

### Variables de Entorno para CI

```yaml
env:
  NODE_ENV: test
  GOOGLE_CALENDAR_ID: test-calendar-id
  GOOGLE_SERVICE_ACCOUNT_EMAIL: test@test.iam.gserviceaccount.com
  GOOGLE_PRIVATE_KEY: '-----BEGIN PRIVATE KEY-----\nTEST_KEY\n-----END PRIVATE KEY-----'
  RESEND_API_KEY: re_test_key
  NEXT_PUBLIC_SITE_URL: http://localhost:3000
```

---

## Solución de Problemas

### "Cannot find module '@/...'"

Verifica que el alias de path esté configurado en `vitest.config.ts`:

```typescript
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
}
```

### "ReferenceError: fetch is not defined"

Asegúrate de que `vitest.setup.ts` incluye:

```typescript
global.fetch = vi.fn();
```

### Tests E2E Fallan Localmente

1. Verifica que los navegadores estén instalados:
   ```bash
   pnpm playwright:install
   ```

2. Verifica que la aplicación esté ejecutándose:
   ```bash
   pnpm dev
   ```

3. Usa modo headed para debug:
   ```bash
   pnpm test:e2e:headed
   ```

### "Module did not self-register"

Si ves este error con sharp o @tailwindcss/oxide:

```bash
pnpm rebuild @tailwindcss/oxide sharp
```

### MSW no intercepta requests

Verifica que el servidor MSW esté iniciado en `vitest.setup.ts`:

```typescript
import { server } from './msw-server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

---

## Best Practices

### Testing en Español

Usa datos de prueba en español para reflejar el contexto real:

```typescript
const mockData = {
  nombre: 'Juan Pérez',
  deporte: 'Béisbol',
  mensaje: 'Me gustaría recibir más información',
};
```

### Nombres de Tests Descriptivos

```typescript
// ✅ Bueno
it('debe validar formato de email correctamente', () => {});

// ❌ Malo
it('test email', () => {});
```

### Arrange-Act-Assert Pattern

```typescript
it('debe registrar un usuario válido', async () => {
  // Arrange
  const userData = createMockRegistroData();

  // Act
  const response = await POST(createRequest('POST', userData));

  // Assert
  expect(response.status).toBe(201);
});
```

### Limpieza de Mocks

```typescript
import { beforeEach, afterEach, vi } from 'vitest';

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.restoreAllMocks();
});
```

### Tests Independientes

Cada test debe ser independiente y no depender del estado de otros tests:

```typescript
// ✅ Bueno
describe('UserService', () => {
  beforeEach(() => {
    // Setup fresh state para cada test
  });
});

// ❌ Malo - tests dependen del orden
let sharedState = {};
it('test 1', () => { sharedState.x = 1; });
it('test 2', () => { expect(sharedState.x).toBe(1); }); // Depende de test 1
```

---

## Recursos Adicionales

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev/)
- [MSW Documentation](https://mswjs.io/)

---

## Mantenimiento del Suite de Tests

### Agregar Nuevos Tests

1. Identifica el tipo de test (unit/integration/e2e)
2. Crea el archivo en la carpeta correspondiente
3. Usa los fixtures y utilidades existentes
4. Ejecuta los tests localmente
5. Verifica que la cobertura no disminuya

### Actualizar Tests Existentes

1. Si cambias la implementación, actualiza los tests correspondientes
2. Ejecuta `pnpm test:coverage` para verificar cobertura
3. Actualiza snapshots si es necesario: `pnpm test -u`

### Deprecar Tests

Si un test ya no es relevante:

1. Marca con `it.skip()` temporalmente
2. Documenta por qué se depreca
3. Elimina después de confirmar que no es necesario

---

## Contacto y Soporte

Si tienes preguntas sobre los tests o encuentras problemas:

1. Revisa esta documentación
2. Consulta la sección de [Solución de Problemas](#solución-de-problemas)
3. Revisa los issues existentes en GitHub
4. Crea un nuevo issue con detalles del problema

---

**¡Feliz Testing! 🧪**
