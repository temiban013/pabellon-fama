# Testing Guide - Pabellón de la Fama de Humacao

Este documento describe la infraestructura de pruebas del proyecto PFDH y cómo ejecutar las pruebas.

## 📋 Tabla de Contenidos

- [Stack de Testing](#stack-de-testing)
- [Estructura de Pruebas](#estructura-de-pruebas)
- [Ejecutar Pruebas](#ejecutar-pruebas)
- [Cobertura de Pruebas](#cobertura-de-pruebas)
- [Escribir Nuevas Pruebas](#escribir-nuevas-pruebas)
- [CI/CD](#cicd)
- [Troubleshooting](#troubleshooting)

## 🛠 Stack de Testing

- **Vitest** - Test runner para unit e integration tests
- **Testing Library** - Testing utilities para React components
- **Playwright** - E2E testing framework
- **MSW (Mock Service Worker)** - API mocking para tests
- **jsdom** - DOM environment para Vitest

## 📁 Estructura de Pruebas

```
tests/
├── unit/                    # Pruebas unitarias
│   ├── lib/                # Tests para funciones de utilidad
│   │   ├── utils.test.ts
│   │   ├── slug.test.ts
│   │   ├── validations.test.ts
│   │   └── googleCalendar.test.ts
│   └── components/         # Tests para componentes React
│       └── SearchBar.test.tsx
├── integration/            # Pruebas de integración
│   └── api/               # Tests para API routes
│       └── eventos.test.ts
├── e2e/                    # Pruebas end-to-end
│   ├── directorio-flow.spec.ts
│   ├── calendario-flow.spec.ts
│   └── registro-flow.spec.ts
├── setup/                  # Configuración de tests
│   ├── vitest.setup.ts
│   ├── test-utils.tsx
│   ├── msw-server.ts
│   └── msw-handlers.ts
└── mocks/                  # Datos de prueba
    ├── data.ts
    └── api-data.ts
```

## 🚀 Ejecutar Pruebas

### Unit & Integration Tests

```bash
# Ejecutar todos los tests en modo watch
pnpm test

# Ejecutar tests una vez (CI mode)
pnpm test:run

# Ejecutar tests con UI interactiva
pnpm test:ui

# Generar reporte de cobertura
pnpm test:coverage
```

### End-to-End Tests

```bash
# Ejecutar E2E tests en modo headless
pnpm test:e2e

# Ejecutar E2E tests con UI
pnpm test:e2e:ui

# Debuggear E2E tests
pnpm test:e2e:debug

# Ejecutar un archivo específico
pnpm exec playwright test tests/e2e/directorio-flow.spec.ts
```

### Ejecutar Todos los Tests

```bash
# Ejecutar unit, integration y E2E tests
pnpm test:all
```

## 📊 Cobertura de Pruebas

### Objetivo de Cobertura

El proyecto apunta a mantener **80%+ de cobertura** en rutas críticas:

- ✅ **70%+** líneas de código
- ✅ **70%+** funciones
- ✅ **65%+** branches
- ✅ **70%+** statements

### Ver Reporte de Cobertura

```bash
# Generar y ver reporte de cobertura
pnpm test:coverage

# El reporte se genera en:
# - coverage/index.html (visual report)
# - coverage/lcov.info (para CI)
```

### Archivos Cubiertos

#### Unit Tests (70-90% coverage target)
- ✅ `src/lib/utils.ts` - Funciones de utilidad
- ✅ `src/lib/utils/slug.ts` - Generación de slugs SEO
- ✅ `src/lib/validations.ts` - Esquemas Zod
- ✅ `src/lib/googleCalendar.ts` - Integración con Google Calendar
- ✅ `src/components/directorio/SearchBar.tsx` - Componente de búsqueda

#### Integration Tests
- ✅ `src/app/api/eventos/route.ts` - API de eventos del calendario

#### E2E Tests (Critical User Flows)
- ✅ Home → Directorio → Search → View Profile
- ✅ Home → Calendario → View Events
- ✅ Home → Registro → Submit → Confirmation

## ✍️ Escribir Nuevas Pruebas

### Unit Test Example

```typescript
// tests/unit/lib/example.test.ts
import { describe, it, expect } from 'vitest'
import { myFunction } from '@/lib/example'

describe('myFunction', () => {
  it('should do something', () => {
    expect(myFunction('input')).toBe('expected output')
  })
})
```

### Component Test Example

```typescript
// tests/unit/components/MyComponent.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen, setupUser } from '../../setup/test-utils'
import { MyComponent } from '@/components/MyComponent'

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('should handle user interaction', async () => {
    const user = setupUser()
    render(<MyComponent />)

    await user.click(screen.getByRole('button'))
    expect(screen.getByText('Clicked')).toBeInTheDocument()
  })
})
```

### E2E Test Example

```typescript
// tests/e2e/example.spec.ts
import { test, expect } from '@playwright/test'

test('should navigate and interact', async ({ page }) => {
  await page.goto('/')
  await page.click('text=Directorio')
  await expect(page).toHaveURL(/\/directorio/)
})
```

## 🔄 CI/CD

### GitHub Actions

El proyecto usa GitHub Actions para ejecutar tests automáticamente:

- **Unit & Integration Tests** - Se ejecutan en cada push y PR
- **E2E Tests** - Se ejecutan en cada push y PR
- **Lint & Type Check** - Se ejecutan en cada push y PR
- **Coverage Report** - Se genera y comenta en PRs

### Workflow Files

```
.github/workflows/
└── tests.yml          # Main test workflow
```

### Triggers

Tests se ejecutan cuando:
- ✅ Push a `main`, `develop`, o branches `claude/**`
- ✅ Pull request a `main` o `develop`
- ✅ Manualmente desde GitHub Actions UI

### Status Badges

Agrega badges al README:

```markdown
![Tests](https://github.com/your-org/pabellon-fama/actions/workflows/tests.yml/badge.svg)
```

## 🐛 Troubleshooting

### Los tests no se ejecutan

```bash
# Reinstalar dependencias
pnpm install

# Limpiar cache de Vitest
pnpm exec vitest --clearCache
```

### Playwright no encuentra browsers

```bash
# Instalar browsers de Playwright
pnpm exec playwright install
```

### Tests fallan en CI pero pasan localmente

Verifica:
1. Variables de entorno en GitHub Secrets
2. Versión de Node.js (debe ser 20+)
3. Timeout de tests en CI (puede ser más lento)

### Errores de importación en tests

Verifica:
1. Alias `@/` está configurado en `vitest.config.ts`
2. Paths en `tsconfig.json` coinciden

### MSW no intercepta requests

```typescript
// Asegúrate que el servidor MSW esté iniciado
// en tests/setup/vitest.setup.ts:
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'warn' })
})
```

## 📚 Recursos

- [Vitest Documentation](https://vitest.dev)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright](https://playwright.dev)
- [MSW](https://mswjs.io)

## 🎯 Mejores Prácticas

1. **Tests en español** - Usa nombres y mensajes en español donde tenga sentido
2. **Datos de prueba realistas** - Usa nombres y datos puertorriqueños
3. **Tests independientes** - Cada test debe poder ejecutarse solo
4. **No compartir estado** - Limpia mocks después de cada test
5. **Descriptivos** - Nombres de tests claros sobre qué están probando
6. **AAA Pattern** - Arrange, Act, Assert
7. **Coverage thoughtfully** - 80% en rutas críticas, no 100% ciego

## 📝 Checklist para PRs

Antes de crear un PR, verifica:

- [ ] Todos los tests pasan localmente (`pnpm test:all`)
- [ ] Nuevas features tienen tests
- [ ] Coverage no bajó en archivos críticos
- [ ] Tests E2E pasan
- [ ] Lint pasa (`pnpm lint`)
- [ ] TypeScript compila sin errores

## 🤝 Contribuir Tests

Para contribuir nuevos tests:

1. Identifica la funcionalidad a probar
2. Escoge el tipo de test apropiado (unit/integration/e2e)
3. Escribe el test siguiendo los ejemplos
4. Verifica que pase
5. Commit con mensaje descriptivo
6. Crea PR

---

**Preguntas?** Abre un issue en GitHub o contacta al equipo de desarrollo.
