# PFDH (Pabellón FAMA) Codebase Exploration Report

**Date:** November 14, 2025  
**Project:** pabellon-fama  
**Framework:** Next.js 15.4.5 with React 19.1.0  
**Language:** TypeScript 5 with Strict Mode  
**Codebase Size:** 864 KB (101 TypeScript/TSX files)

---

## 1. PROJECT STRUCTURE OVERVIEW

```
pabellon-fama/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── api/                      # API routes
│   │   │   ├── registro/            # POST registration endpoint
│   │   │   ├── eventos/             # GET events from Google Calendar
│   │   │   └── admin/resgistraciones/  # Admin registrations endpoint
│   │   ├── directorio/              # Athlete directory pages
│   │   ├── calendario/              # Calendar page
│   │   ├── revistas/                # Magazine pages
│   │   ├── historia/                # History page
│   │   └── layout.tsx               # Root layout
│   ├── components/                  # React components
│   │   ├── directorio/              # Athlete directory components
│   │   ├── forms/                   # Form components
│   │   ├── layout/                  # Layout components
│   │   ├── ui/                      # UI components (GoogleMap, Toast)
│   │   └── shared/                  # Shared components
│   ├── hooks/                       # Custom React hooks
│   ├── lib/                         # Utilities and helpers
│   │   ├── googleCalendar.ts       # Google Calendar integration
│   │   ├── validations.ts          # Zod schemas
│   │   ├── types.ts                # TypeScript types
│   │   └── utils/                  # Helper functions
│   └── data/                        # Static data files
│       ├── exaltados.json          # Athlete registry (JSON)
│       └── exaltados-all.ts        # Athlete registry (TypeScript)
├── package.json                     # Dependencies
├── tsconfig.json                    # TypeScript config
├── next.config.ts                   # Next.js config
└── tailwind.config.ts               # Tailwind CSS config
```

---

## 2. KEY DEPENDENCIES

### Core Framework
- **next**: 15.4.5 (App Router)
- **react**: 19.1.0
- **react-dom**: 19.1.0
- **typescript**: 5.x (Strict mode)

### Data Validation & API
- **zod**: 4.0.17 (Type-safe schema validation)
- **googleapis**: 164.0.0 (Google Calendar API)
- **resend**: 6.3.0 (Email service)

### UI & Styling
- **tailwindcss**: 3.4.17
- **@tailwindcss/postcss**: 4.x
- **@heroicons/react**: 2.2.0 (Icon library)
- **lucide-react**: 0.539.0 (Icon library)

### Utilities
- **js-cookie**: 3.0.5 (Cookie management)
- **clsx**: 2.1.1 (Conditional CSS classes)
- **tailwind-merge**: 3.3.1 (Merge Tailwind classes)
- **web-vitals**: 5.1.0 (Performance metrics)

### Build & Development
- **eslint**: 9.x
- **@types/node**: 20.x
- **@types/react**: 19.x
- **@types/react-dom**: 19.x

**No existing test framework installed** (Jest, Vitest, or Testing Library not present)

---

## 3. LOCATION OF KEY FILES

### Google Calendar Integration
**File:** `/home/user/pabellon-fama/src/lib/googleCalendar.ts`

**Purpose:** Fetches and transforms Google Calendar events to internal Evento format

**Key Functions:**
- `fetchCalendarEvents()` - Main function to fetch events with filtering
- `fetchUpcomingEvents()` - Upcoming events from today onwards
- `fetchEventsInRange()` - Events within date range
- `fetchEventsThisMonth()` - Current month's events
- `transformGoogleEventToEvento()` - Maps Google Calendar events to Evento type
- `extractMetadata()` - Parses metadata from event descriptions (METADATA block)
- `cleanDescription()` - Sanitizes event descriptions
- `mapColorToTipo()` - Maps Google Calendar colors to event types

**Key Features:**
- Service Account authentication with JWT
- Metadata extraction from structured description format
- Event type mapping via color IDs or metadata
- Puerto Rico timezone support (America/Puerto_Rico)
- Event filtering by capacity, registration requirement, etc.

### Component Structure

#### Directory Components
Located in `/home/user/pabellon-fama/src/components/directorio/`

1. **ExaltadoCard.tsx** - Individual athlete/exaltado card component
   - Props: `exaltado: Exaltado`, `viewMode: "grid" | "list"`, `className?: string`
   - Displays athlete info with photo, name, sports, category
   - Memoized for performance
   - Supports grid and list view modes

2. **DirectorioClient.tsx** - Main directory client component
   - Orchestrates filtering, pagination, and display
   - Uses `useAthleteFilter` hook for advanced filtering
   - Integrates with SearchFilters component
   - Pagination: 12 items per page
   - Transforms ExaltadoRevista to Exaltado format

3. **SearchFilters.tsx** - Advanced search and filter panel
   - Text search with debounce (300ms)
   - Multi-select sports filter (pills)
   - Decade filter dropdown (1980s-2020s)
   - Category filter (pills) - 14 categories
   - Status filter (todos/activos/fallecidos)
   - Active filter summary display
   - Mobile-responsive design

4. **ExaltadoDetail.tsx** - Detailed athlete profile page

5. **Pagination.tsx** - Pagination control component

6. **ViewToggle.tsx** - Grid/List view toggle

#### Form Components
Located in `/home/user/pabellon-fama/src/components/forms/`

1. **RegistroForm.tsx** - Registration form component
   - Client component ("use client")
   - Two-stage form:
     - Stage 1: Email only
     - Stage 2: Full form (name, phone, interest, message)
   - Integrated with `useRegistro` hook
   - Toast notifications for success/error
   - Field-level validation error display
   - Input validation with icons

2. **RegistroFormClient.tsx** - Alternative form implementation

#### Other Key Components
- **GoogleMap.tsx** - Google Maps integration
- **Toast.tsx** - Toast notification system
- **Header.tsx**, **Footer.tsx** - Layout components
- **Analytics.tsx**, **CookieConsent.tsx** - Analytics and consent

### Note: No AthleteCard or EventCard Components
The codebase uses **ExaltadoCard** (not AthleteCard) and does not have a dedicated EventCard component. Events are rendered in the calendario page directly from the Evento type.

---

## 4. API ROUTES STRUCTURE

### 1. POST /api/registro - User Registration

**Location:** `/home/user/pabellon-fama/src/app/api/registro/route.ts`

**Request:**
```json
{
  "email": "user@example.com",
  "nombre": "John Doe",
  "telefono": "787-123-4567",
  "interes": "visitante|voluntario|investigador|general",
  "mensaje": "Optional message"
}
```

**Features:**
- Zod validation via `validateRegistroApi()`
- Rate limiting: 5 requests per hour per IP
- CORS headers with origin checking
- Email validation (format, 255 char max)
- Phone validation (regex: US/PR format)
- Interest type enum validation
- Message max length: 500 chars
- Resend email service integration
- HTML email template generation
- XSS prevention via HTML escaping
- Client IP detection (x-forwarded-for, x-real-ip, cf-connecting-ip)

**Response:**
```json
{
  "success": true,
  "data": {
    "email": "user@example.com",
    "mensaje": "¡Gracias por tu interés..."
  },
  "message": "Registro completado exitosamente"
}
```

**Error Handling:**
- 400: Invalid JSON or Content-Type
- 415: Wrong Content-Type
- 422: Validation errors
- 429: Rate limit exceeded
- 500: Server error or email sending failure

---

### 2. GET /api/eventos - Calendar Events

**Location:** `/home/user/pabellon-fama/src/app/api/eventos/route.ts`

**Query Parameters:**
- `mode`: "upcoming" (default) | "range" | "month"
- `startDate`: ISO date string (required for range mode)
- `endDate`: ISO date string (required for range mode)
- `maxResults`: number (default: 50)
- `tipo`: filter by event type

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "event-id",
      "titulo": "Event Title",
      "descripcion": "Event description",
      "fecha": "2025-12-20T00:00:00Z",
      "horaInicio": "06:00 PM",
      "horaFin": "08:00 PM",
      "ubicacion": "Museo",
      "tipo": "ceremonia|museo|educativo|especial|reunion",
      "estado": "programado",
      "requiresRegistro": false,
      "capacidadMaxima": 500
    }
  ],
  "metadata": {
    "count": 5,
    "cached": false,
    "timestamp": "2025-11-14T18:30:00Z"
  }
}
```

**Features:**
- Fetches from Google Calendar API
- Transforms Google events to internal format
- Event type mapping via metadata or color IDs
- Metadata extraction: capacity, registration required, highlighted status
- Auto-sorting by date (ascending)
- Caching: 1 minute
- CORS enabled
- Error handling for authentication and quota issues

---

### 3. Admin Routes

**Location:** `/home/user/pabellon-fama/src/app/api/admin/resgistraciones/route.ts` (Note: typo in "resgistraciones")

**Purpose:** Admin endpoint for viewing registrations (partial implementation)

---

## 5. VALIDATION & ZOD SCHEMAS

**Location:** `/home/user/pabellon-fama/src/lib/validations.ts`

### registroSchema (Form Validation)
```typescript
{
  email: required, email format, max 255 chars
  nombre: optional, 2-100 chars, letters + spaces + Spanish chars only
  telefono: optional, PR/US phone format (787-123-4567)
  interes: required enum (visitante|voluntario|investigador|general)
  mensaje: optional, max 500 chars
}
```

### registroApiSchema (API Validation - More Strict)
```typescript
Extends registroSchema with:
  nombre: required (not optional like in form)
```

### Helper Functions
- `validateRegistro(data)` - safeParse for form input
- `validateRegistroApi(data)` - safeParse for API input

---

## 6. TYPE DEFINITIONS

**Location:** `/home/user/pabellon-fama/src/lib/types.ts` (473 lines)

### Core Types

#### Exaltado (Athlete/Honored Person)
- `id`: string
- `nombre`, `apellidos`, `nombreCompleto`: strings
- `deporte`: string[] (multiple sports)
- `categoria`: CategoriaExaltado enum (14 values)
- `anoExaltacion`: number
- `biografia`: string
- `logros`: Logro[] | string[]
- `reconocimientos`: Reconocimiento[] | string[]
- `foto`, `galeria`: image paths
- `estado`: "activo" | "fallecido"
- Plus 30+ additional optional fields for various career types

#### CategoriaExaltado Enum
atleta, jugador, boxeador, entrenador, dirigente, promotor, propulsor, comentarista, cronista, arbitro, benefactor, equipo, atleta-propulsor, jugador-propulsor

#### Evento
- `id`, `titulo`, `descripcion`, `fecha`, `horaInicio`, `horaFin`
- `ubicacion`: string
- `tipo`: TipoEvento enum
- `estado`: EstadoEvento enum
- `requiresRegistro`: boolean
- `capacidadMaxima`: number

#### RegistroUsuario
- `id?`, `email`, `nombre?`, `telefono?`
- `interes`: "visitante" | "voluntario" | "investigador" | "general"
- `mensaje?`
- `fechaRegistro?`, `activo?`

#### FiltrosDirectorio
```typescript
{
  deporte?: string[]
  categoria?: CategoriaExaltado[]
  genero?: ("masculino" | "femenino" | "equipo")[]
  anoDesde?, anoHasta?: number
  busqueda?: string
  ordenarPor?: "nombre" | "ano" | "deporte"
  direccion?: "asc" | "desc"
}
```

---

## 7. CUSTOM HOOKS

### useAthleteFilter
**Location:** `/home/user/pabellon-fama/src/hooks/useAthleteFilter.ts`

**Purpose:** Advanced filtering of athletes with debounce and performance optimization

**Features:**
- Text search with debounce (configurable, default 300ms)
- Multi-filter accumulation (AND logic)
- Decade range filtering (1980s-2020s)
- Category filtering (multi-select)
- Status filtering (todos/activos/fallecidos)
- Computes available filters dynamically
- Sub-100ms performance target
- URL query param sync support

**Returns:**
```typescript
{
  filteredAthletes: Exaltado[]
  filters: AthleteFilters
  setSearchText, setDeportes, setDecada, setCategorias, setEstado
  clearAllFilters
  totalAthletes: number
  hasActiveFilters: boolean
  availableDeportes: string[]
  availableCategorias: CategoriaExaltado[]
}
```

### useRegistro
**Location:** `/home/user/pabellon-fama/src/hooks/useRegistro.ts`

**Purpose:** Manage registration form state and submission

**Features:**
- Form state management (loading, success, error)
- Field-level validation errors
- Form data updates with error clearing
- API submission with AbortController for cancellation
- Form reset capability
- Validation via Zod

**Returns:**
```typescript
{
  formData: RegistroFormData
  formState: FormState (isLoading, isSuccess, error)
  validationErrors: ValidationErrors
  updateField(field, value)
  submitForm(): Promise<void>
  resetForm(): void
}
```

### useAutoTracking
**Location:** `/home/user/pabellon-fama/src/hooks/useAutoTracking.ts`

**Purpose:** Analytics tracking hook

---

## 8. SEARCH/FILTER LOGIC FOR DIRECTORIO

**Location:** `/home/user/pabellon-fama/src/components/directorio/`

### Filter Pipeline

1. **SearchFilters Component** (UI)
   - Captures user inputs
   - Provides filter options with dynamic data
   - Shows active filter summary

2. **useAthleteFilter Hook** (Logic)
   - Applies filters in sequence:
     - Text search on name, sports, biography (case-insensitive)
     - Sport filter (array includes)
     - Decade range filter
     - Category filter
     - Status filter (activo/fallecido)

3. **DirectorioClient** (Orchestration)
   - Loads all exaltados from `exaltados-all.ts`
   - Applies hooks and pagination
   - Renders ExaltadoCard in grid (3 cols) or list view
   - 12 items per page pagination

### Data Source
- **exaltados-all.ts**: Transformed from magazine data format
- **exaltados.json**: Raw JSON registry (nested by sport)

### Performance Optimizations
- ExaltadoCard is memoized
- useAthleteFilter uses debounce
- useMemo for computed values
- Pagination reduces DOM nodes

---

## 9. DATA STRUCTURE

### exaltados.json Format
```json
{
  "sport-name": {
    "atletas": [
      {
        "id": "unique-id",
        "nombre": "First Name",
        "apellidos": "Last Name",
        "nombreCompleto": "First Last",
        "deporte": ["Sport Name"],
        "categoria": "atleta",
        "anoExaltacion": 2000,
        "biografia": "...",
        "logros": [],
        "reconocimientos": [],
        "foto": "/images/path.jpg",
        "estado": "activo"
      }
    ]
  }
}
```

### Sports Covered
Athletics, Martial Arts, Baseball, Basketball, Volleyball, Boxing, Cricket, Cycling, Equestrian, Fencing, Football, Golf, Gymnastics, Horse Racing, Swimming, Table Tennis, Tennis, Track & Field, Weightlifting, Wrestling, and more

---

## 10. EXISTING TEST FILES AND CONFIGURATION

**Status:** NO TESTS CONFIGURED

### Findings
- No Jest configuration (`jest.config.js`, `jest.config.ts`)
- No Vitest configuration
- No Testing Library packages installed
- No test files found (`*.test.ts`, `*.test.tsx`, `*.spec.ts`, `*.spec.tsx`)
- No test directory structure

### Build Configuration
- **tsconfig.json**: Strict mode enabled, ES2017 target
- **next.config.ts**: Includes security headers, CORS, redirects
- **eslint.config.mjs**: ESLint 9.x configured
- **tailwind.config.ts**: Tailwind CSS configured

### Missing from package.json
- jest / vitest
- @testing-library/react
- @testing-library/jest-dom
- @types/jest
- ts-jest / vitest

---

## 11. ENVIRONMENT VARIABLES REQUIRED

### Google Calendar Integration
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `GOOGLE_PRIVATE_KEY`
- `GOOGLE_CALENDAR_ID` (default: pabellonfdh@gmail.com)

### Email Service (Resend)
- `RESEND_API_KEY`

### SEO & URLs
- `NEXT_PUBLIC_CALENDAR_PUBLIC_URL` (optional)

---

## 12. PROJECT STATISTICS

- **Total TypeScript/TSX Files:** 101
- **Source Code Size:** 864 KB
- **React Components:** ~40
- **API Routes:** 3 main routes
- **Custom Hooks:** 3
- **Type Definitions:** 40+
- **Validation Schemas:** 3 (registroSchema, registroApiSchema, emailResponseSchema)

---

## 13. SECURITY FEATURES IMPLEMENTED

1. **CORS Configuration**
   - Origin validation based on NODE_ENV
   - Specific allowed methods and headers
   - Preflight OPTIONS handling

2. **Input Validation**
   - Zod schema validation
   - Email format validation
   - Phone format validation (regex)
   - Message length limits
   - Name character restrictions

3. **XSS Prevention**
   - HTML escaping in email templates
   - Safe property rendering

4. **Rate Limiting**
   - IP-based rate limiting on registration
   - 5 requests per hour per IP
   - Automatic cleanup of old rate limit entries

5. **Security Headers** (Next.js Config)
   - X-Frame-Options: DENY
   - X-Content-Type-Options: nosniff
   - Referrer-Policy
   - Permissions-Policy
   - CSP for image SVG

6. **API Response Headers**
   - Cache-Control headers
   - No-store directives for sensitive data

---

## 14. DEPLOYMENT CONFIGURATION

- **Next.js Build:** Standard build, no custom build scripts
- **Image Optimization:** WebP and AVIF formats
- **Domains:** localhost, pabellon.org, pabellondelafama.org, pfdh.org
- **Compression:** Enabled
- **SEO:** Sitemap generation, robots.txt, structured data (BreadcrumbJsonLd)

---

## 15. RECOMMENDATIONS FOR TEST SUITE

Based on this codebase structure, here are critical areas to test:

### High Priority
1. **Zod Validations** - Core data integrity
2. **useRegistro Hook** - Form state management
3. **useAthleteFilter Hook** - Complex filter logic
4. **API Routes** (/api/registro, /api/eventos)
5. **SearchFilters Component** - User interaction

### Medium Priority
1. **ExaltadoCard** - Component rendering with different data
2. **DirectorioClient** - Pagination and display logic
3. **googleCalendar.ts** - Event transformation logic
4. **Rate limiting logic** - Security feature

### Infrastructure Needed
- Jest or Vitest for unit/integration tests
- @testing-library/react for component testing
- Mock for Google Calendar API
- Mock for Resend email service
- Mock for Next.js router/navigation

---

**End of Report**
