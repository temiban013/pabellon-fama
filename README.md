# Pabellón de la Fama del Deporte Humacaeño (PFDH)

Sitio web oficial del Pabellón de la Fama del Deporte Humacaeño - Una plataforma para honrar y preservar el legado deportivo de Humacao, República Dominicana.

## Tabla de Contenidos

- [Acerca del Proyecto](#acerca-del-proyecto)
- [Tecnologías](#tecnologías)
- [Comenzar](#comenzar)
- [Testing](#testing)
- [Scripts Disponibles](#scripts-disponibles)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Características Principales](#características-principales)
- [Contribuir](#contribuir)
- [Licencia](#licencia)

## Acerca del Proyecto

El Pabellón de la Fama del Deporte Humacaeño (PFDH) es una plataforma web diseñada para:

- 📋 **Directorio de Exaltados**: Explorar y buscar atletas honrados con filtros avanzados
- 📅 **Calendario de Eventos**: Visualizar próximos eventos y ceremonias de exaltación
- 📧 **Registro de Interesados**: Sistema de contacto para visitantes, voluntarios e investigadores
- 🏆 **Historia Deportiva**: Preservar el legado deportivo de Humacao

## Tecnologías

Este proyecto está construido con tecnologías modernas de desarrollo web:

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Lenguaje**: [TypeScript 5](https://www.typescriptlang.org/)
- **Estilos**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Validación**: [Zod](https://zod.dev/)
- **Calendar API**: [Google Calendar API](https://developers.google.com/calendar)
- **Email**: [Resend](https://resend.com/)
- **Testing**: [Vitest](https://vitest.dev/), [Playwright](https://playwright.dev/), [Testing Library](https://testing-library.com/)
- **Package Manager**: [pnpm](https://pnpm.io/)

## Comenzar

### Prerrequisitos

- Node.js 20.x o superior
- pnpm 8.x o superior

### Instalación

1. Clonar el repositorio:

```bash
git clone https://github.com/temiban013/pabellon-fama.git
cd pabellon-fama
```

2. Instalar dependencias:

```bash
pnpm install
```

3. Configurar variables de entorno:

```bash
cp .env.example .env.local
```

Edita `.env.local` y configura las siguientes variables:

```env
# Google Calendar API
GOOGLE_CALENDAR_ID=tu-calendar-id@group.calendar.google.com
GOOGLE_SERVICE_ACCOUNT_EMAIL=tu-service-account@proyecto.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"

# Resend Email API
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

4. Ejecutar el servidor de desarrollo:

```bash
pnpm dev
```

5. Abrir [http://localhost:3000](http://localhost:3000) en tu navegador.

## Testing

Este proyecto cuenta con una suite de tests completa con cobertura del 80%+ en rutas críticas.

### Ejecutar Tests

```bash
# Tests unitarios y de integración (modo watch)
pnpm test

# Ejecutar todos los tests una vez
pnpm test:run

# Tests con cobertura
pnpm test:coverage

# Tests E2E
pnpm test:e2e

# Todos los tests (unit + integration + E2E)
pnpm test:all
```

### Documentación de Testing

- **[INSTALL_TESTS.md](./INSTALL_TESTS.md)** - Guía de instalación de dependencias de testing
- **[TESTING.md](./TESTING.md)** - Documentación completa del suite de tests

### Stack de Testing

- **Vitest** - Test runner para unit e integration tests
- **Playwright** - Framework para E2E tests
- **Testing Library** - Testing de componentes React
- **MSW** - Mock Service Worker para API mocking

## Scripts Disponibles

### Desarrollo

```bash
pnpm dev          # Servidor de desarrollo
pnpm build        # Build para producción
pnpm start        # Servidor de producción
pnpm lint         # Ejecutar ESLint
pnpm type-check   # Verificar tipos TypeScript
```

### Testing

```bash
pnpm test              # Tests unitarios (watch mode)
pnpm test:run          # Ejecutar tests una vez
pnpm test:ui           # UI interactiva de Vitest
pnpm test:coverage     # Tests con reporte de cobertura
pnpm test:e2e          # Tests E2E con Playwright
pnpm test:e2e:ui       # UI de Playwright
pnpm test:e2e:headed   # Tests E2E con navegador visible
pnpm test:e2e:debug    # Debug de tests E2E
pnpm test:all          # Todos los tests
pnpm playwright:install # Instalar navegadores Playwright
```

## Estructura del Proyecto

```
pabellon-fama/
├── src/
│   ├── app/                  # App Router de Next.js
│   │   ├── api/             # API routes
│   │   ├── directorio/      # Página del directorio
│   │   ├── eventos/         # Página de eventos
│   │   └── registro/        # Página de registro
│   ├── components/          # Componentes React
│   │   ├── ui/             # Componentes base (shadcn/ui)
│   │   ├── directorio/     # Componentes del directorio
│   │   ├── eventos/        # Componentes de eventos
│   │   └── registro/       # Componentes de registro
│   ├── lib/                 # Utilidades y librerías
│   │   ├── validations.ts  # Esquemas de validación Zod
│   │   ├── googleCalendar.ts # Integración Google Calendar
│   │   └── types.ts        # Tipos TypeScript compartidos
│   └── hooks/               # Custom React hooks
├── tests/                   # Suite de tests
│   ├── setup/              # Configuración de testing
│   ├── fixtures/           # Datos de prueba
│   ├── unit/               # Tests unitarios
│   ├── integration/        # Tests de integración
│   └── e2e/                # Tests E2E
├── public/                  # Archivos estáticos
└── .github/
    └── workflows/          # GitHub Actions CI/CD
```

## Características Principales

### 🔍 Directorio de Exaltados

- Búsqueda y filtrado avanzado por deporte, categoría y año
- Visualización en grid/lista
- Perfiles detallados de cada exaltado
- Responsive design para móvil y desktop

### 📅 Calendario de Eventos

- Integración con Google Calendar API
- Visualización de próximos eventos
- Detalles de ceremonias de exaltación
- Actualización automática

### 📧 Sistema de Registro

- Formulario de contacto validado
- Categorías: Visitante, Voluntario, Investigador, General
- Validación de datos en español (nombres con acentos, teléfonos dominicanos)
- Envío de confirmación por email vía Resend
- Rate limiting para prevenir spam

### ✅ Validación de Datos

- Esquemas Zod con mensajes en español
- Validación de emails, teléfonos, nombres
- Sanitización de HTML para prevenir XSS
- Límites de longitud de campos

### 🔒 Seguridad

- Headers de seguridad (CSP, X-Frame-Options, etc.)
- Rate limiting en API endpoints
- Validación server-side
- Sanitización de inputs

## CI/CD

El proyecto incluye un workflow de GitHub Actions que ejecuta automáticamente:

- ✅ Tests unitarios y de integración
- ✅ Tests E2E
- ✅ Linting (ESLint)
- ✅ Type checking (TypeScript)
- ✅ Verificación de cobertura (80%+ en rutas críticas)

Ver: [.github/workflows/tests.yml](./.github/workflows/tests.yml)

## Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Guidelines

- Escribe tests para nuevas funcionalidades
- Mantén la cobertura de tests al 80%+
- Sigue las convenciones de código existentes
- Actualiza la documentación según sea necesario

## Documentación Adicional

- **[CODEBASE_EXPLORATION.md](./CODEBASE_EXPLORATION.md)** - Exploración detallada del codebase
- **[TEST_SETUP_CHECKLIST.md](./TEST_SETUP_CHECKLIST.md)** - Checklist de configuración de tests
- **[TESTING.md](./TESTING.md)** - Documentación completa de testing
- **[INSTALL_TESTS.md](./INSTALL_TESTS.md)** - Guía de instalación de testing

## Recursos

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

**Desarrollado con ❤️ para el Pabellón de la Fama del Deporte Humacaeño**
