# Guía de Instalación - Suite de Tests PFDH

Esta guía te ayudará a instalar y configurar el suite de tests para el Pabellón de la Fama del Deporte Humacaeño.

## Prerrequisitos

- Node.js 20.x o superior
- pnpm 8.x o superior
- Git

## Instalación Paso a Paso

### 1. Verificar Versiones

```bash
node --version  # Debe ser >= 20.x
pnpm --version  # Debe ser >= 8.x
```

### 2. Instalar Dependencias de Testing

#### Opción A: Instalación Completa (Recomendada)

```bash
# Instalar todas las dependencias de testing en un solo comando
pnpm add -D \
  vitest \
  @vitest/ui \
  @vitest/coverage-v8 \
  @vitejs/plugin-react \
  jsdom \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event \
  msw \
  @playwright/test
```

#### Opción B: Instalación por Partes

```bash
# 1. Vitest y herramientas core
pnpm add -D vitest @vitest/ui @vitest/coverage-v8 @vitejs/plugin-react jsdom

# 2. React Testing Library
pnpm add -D @testing-library/react @testing-library/jest-dom @testing-library/user-event

# 3. MSW para API mocking
pnpm add -D msw

# 4. Playwright para E2E tests
pnpm add -D @playwright/test
```

### 3. Instalar Navegadores de Playwright

```bash
# Instalar todos los navegadores y dependencias del sistema
pnpm playwright:install

# O instalar solo Chromium (más rápido)
pnpm exec playwright install chromium --with-deps
```

### 4. Verificar Instalación

```bash
# Verificar que vitest está instalado
pnpm vitest --version

# Verificar que playwright está instalado
pnpm exec playwright --version

# Listar tests disponibles
pnpm test --list
```

### 5. Ejecutar Tests de Verificación

```bash
# Ejecutar tests unitarios
pnpm test:run

# Si hay errores de módulos, ejecutar:
pnpm install

# Ejecutar un test E2E de prueba
pnpm test:e2e registro --headed
```

## Solución de Problemas Comunes

### Error: "Cannot find module 'vitest'"

```bash
# Limpiar node_modules y reinstalar
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Error: "Playwright browsers not found"

```bash
# Reinstalar navegadores de Playwright
pnpm playwright:install
```

### Error: "Module did not self-register" (sharp, @tailwindcss/oxide)

```bash
# Reconstruir módulos nativos
pnpm rebuild @tailwindcss/oxide sharp

# O desde package.json postinstall
pnpm install
```

### Error: "EACCES: permission denied"

```bash
# En Linux/Mac, puede necesitar permisos
sudo pnpm playwright:install
```

### Error: Network timeout durante instalación

```bash
# Aumentar timeout de pnpm
pnpm config set network-timeout 600000

# Reintentar instalación
pnpm install
```

### Error: "fetch is not defined" en tests

Esto ya está manejado en `tests/setup/vitest.setup.ts`. Si aún aparece:

```typescript
// Agregar al inicio del archivo de test
global.fetch = vi.fn();
```

## Configuración de IDE

### VS Code

Instalar extensiones recomendadas:

```json
{
  "recommendations": [
    "ZixuanChen.vitest-explorer",
    "ms-playwright.playwright",
    "firsttris.vscode-jest-runner"
  ]
}
```

Configuración en `.vscode/settings.json`:

```json
{
  "vitest.enable": true,
  "vitest.commandLine": "pnpm vitest",
  "playwright.reuseBrowser": true
}
```

### WebStorm / IntelliJ IDEA

1. Ir a Preferences → Languages & Frameworks → JavaScript → Test Frameworks
2. Seleccionar "Vitest" como test runner
3. Configurar node interpreter y working directory

## Variables de Entorno para Tests

Crear archivo `.env.test` (opcional):

```bash
# .env.test
NODE_ENV=test
GOOGLE_CALENDAR_ID=test-calendar-id
GOOGLE_SERVICE_ACCOUNT_EMAIL=test@test.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY='-----BEGIN PRIVATE KEY-----\nTEST_KEY\n-----END PRIVATE KEY-----'
RESEND_API_KEY=re_test_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Nota:** Las variables de entorno ya están configuradas en `tests/setup/vitest.setup.ts` para testing, por lo que este archivo es opcional.

## Estructura de Archivos de Configuración

Después de la instalación, deberías tener:

```
proyecto/
├── vitest.config.ts          # Configuración de Vitest
├── playwright.config.ts       # Configuración de Playwright
├── tests/
│   ├── setup/
│   │   ├── vitest.setup.ts   # Setup global de Vitest
│   │   ├── test-utils.tsx    # Utilidades de testing
│   │   ├── msw-server.ts     # Servidor MSW
│   │   └── msw-handlers.ts   # Handlers de API
│   ├── fixtures/
│   │   └── mock-data.ts      # Datos de prueba
│   ├── unit/                  # Tests unitarios
│   ├── integration/           # Tests de integración
│   └── e2e/                   # Tests E2E
└── .github/
    └── workflows/
        └── tests.yml          # CI/CD workflow
```

## Scripts NPM Disponibles

```bash
# Tests unitarios e integración
pnpm test              # Modo watch
pnpm test:run          # Ejecutar una vez
pnpm test:ui           # UI interactiva
pnpm test:coverage     # Con cobertura

# Tests E2E
pnpm test:e2e          # Ejecutar E2E
pnpm test:e2e:ui       # UI de Playwright
pnpm test:e2e:headed   # Ver navegador
pnpm test:e2e:debug    # Modo debug

# Todos los tests
pnpm test:all          # Unit + Integration + E2E

# Utilidades
pnpm playwright:install  # Instalar navegadores
```

## Verificación Final

Ejecuta este comando para verificar que todo esté instalado correctamente:

```bash
# Test completo de verificación
pnpm test:run && pnpm test:e2e --project=chromium
```

Si todos los tests pasan, ¡la instalación fue exitosa! ✅

## Próximos Pasos

1. Lee la documentación completa en [TESTING.md](./TESTING.md)
2. Explora los tests existentes en `tests/`
3. Ejecuta `pnpm test:ui` para ver la interfaz interactiva
4. Ejecuta `pnpm test:coverage` para ver el reporte de cobertura

## Comandos de Mantenimiento

```bash
# Actualizar dependencias de testing
pnpm update vitest @vitest/ui @playwright/test

# Limpiar cache de Vitest
pnpm vitest --clearCache

# Actualizar navegadores de Playwright
pnpm playwright:install

# Limpiar completamente y reinstalar
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm playwright:install
```

## Soporte

Si encuentras problemas durante la instalación:

1. Consulta la sección [Solución de Problemas](./TESTING.md#solución-de-problemas) en TESTING.md
2. Revisa los logs de error completos
3. Verifica versiones de Node.js y pnpm
4. Intenta limpiar y reinstalar dependencias
5. Crea un issue en GitHub con detalles del error

---

**Instalación completada con éxito** ✅

Para más información, consulta [TESTING.md](./TESTING.md)
