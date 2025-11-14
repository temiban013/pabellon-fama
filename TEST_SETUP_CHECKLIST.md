# Test Suite Setup Checklist for PFDH

## Quick Reference Summary

### Current State
- Framework: Next.js 15.4.5 + React 19.1.0 + TypeScript 5 (strict mode)
- No tests configured yet (no Jest/Vitest/Testing Library)
- 101 TypeScript/TSX files, 40+ React components
- 3 custom hooks, 3 API routes
- Zod validation enabled (4.0.17)

### Key Testing Targets (Priority Order)

#### 1. Validation Layer (CRITICAL)
- `src/lib/validations.ts` - 3 schemas
  - registroSchema (form validation)
  - registroApiSchema (API validation)
  - emailResponseSchema
- Tests: Edge cases, invalid input, error messages

#### 2. Custom Hooks (CRITICAL)
- **useRegistro** (`src/hooks/useRegistro.ts`)
  - Form state management
  - Validation error handling
  - API submission with AbortController
  - Form reset
  
- **useAthleteFilter** (`src/hooks/useAthleteFilter.ts`)
  - Multi-filter logic (text, sports, decade, category, status)
  - Debounce functionality
  - Performance optimization
  - Filter combinations

#### 3. API Routes (CRITICAL)
- **POST /api/registro**
  - Validation, rate limiting, CORS
  - Email service integration
  - Error handling (4xx/5xx responses)
  - Security (XSS, rate limit bypass attempts)
  
- **GET /api/eventos**
  - Event fetching and filtering
  - Date range handling
  - Response format validation
  - Error handling (no credentials, quota exceeded)

#### 4. Components (HIGH PRIORITY)
- **SearchFilters** - User interactions, filter state changes
- **DirectorioClient** - Pagination, data flow
- **ExaltadoCard** - Rendering with different data types
- **RegistroForm** - Two-stage form, validation display

#### 5. Core Functions (MEDIUM PRIORITY)
- `googleCalendar.ts`
  - Event transformation
  - Metadata extraction
  - Color to type mapping
  - Date/time formatting
  
- Rate limiting logic
- Data transformations

### Files to Test

```
HIGH PRIORITY
├── src/lib/validations.ts (validation schemas)
├── src/lib/googleCalendar.ts (event transformation)
├── src/hooks/useRegistro.ts (form state)
├── src/hooks/useAthleteFilter.ts (filter logic)
├── src/app/api/registro/route.ts (registration API)
├── src/app/api/eventos/route.ts (events API)
├── src/components/directorio/SearchFilters.tsx
└── src/components/forms/RegistroForm.tsx

MEDIUM PRIORITY
├── src/components/directorio/DirectorioClient.tsx
├── src/components/directorio/ExaltadoCard.tsx
├── src/lib/types.ts (type exports)
└── src/lib/utils.ts (utility functions)

LOWER PRIORITY
├── src/components/layout/
├── src/components/shared/
└── src/components/ui/ (GoogleMap, Toast)
```

### Test Infrastructure Needed

```
npm/pnpm install --save-dev:
- jest (or vitest)
- @testing-library/react
- @testing-library/jest-dom
- @testing-library/user-event
- jest-environment-jsdom
- @types/jest
- ts-jest (if using Jest)
- @next/test
```

### Mocks Required

```
1. Google Calendar API
   - google.calendar.events.list()
   - Returns: { data: { items: [...] } }

2. Resend Email Service
   - resend.emails.send()
   - Returns: { data: { id: "..." }, error: null }

3. Next.js Router/Navigation
   - useRouter(), useSearchParams(), usePathname()
   - Link component

4. Environment Variables
   - GOOGLE_SERVICE_ACCOUNT_EMAIL
   - GOOGLE_PRIVATE_KEY
   - RESEND_API_KEY
   - NODE_ENV

5. Fetch API
   - For API route testing
```

### Key Test Scenarios

#### Validation Tests
- Valid email formats
- Invalid email formats
- Phone number formats (PR/US)
- Name character restrictions
- Message length limits
- Enum value validation

#### Hook Tests
- Initial state
- State updates
- Multiple filter combinations
- Debounce timing
- Error states
- Reset functionality
- API call lifecycle

#### API Tests
- Valid request handling
- Invalid input rejection
- Rate limit enforcement
- CORS header validation
- Email sending success/failure
- Google Calendar API errors
- Response format validation

#### Component Tests
- Rendering with data
- User interactions (clicks, inputs)
- Error display
- Loading states
- Pagination
- Filter application
- View mode switching

### Environment Variables for Testing

```
GOOGLE_SERVICE_ACCOUNT_EMAIL=test-account@example.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBg..."
RESEND_API_KEY=test_api_key_12345
NODE_ENV=test
```

### File Structure After Setup

```
pabellon-fama/
├── __tests__/                          # Top-level test directory
│   ├── unit/
│   │   ├── validations.test.ts
│   │   ├── hooks/
│   │   │   ├── useRegistro.test.ts
│   │   │   └── useAthleteFilter.test.ts
│   │   └── lib/
│   │       ├── googleCalendar.test.ts
│   │       └── utils.test.ts
│   ├── integration/
│   │   ├── api-registro.test.ts
│   │   └── api-eventos.test.ts
│   ├── components/
│   │   ├── SearchFilters.test.tsx
│   │   ├── RegistroForm.test.tsx
│   │   ├── DirectorioClient.test.tsx
│   │   └── ExaltadoCard.test.tsx
│   └── mocks/
│       ├── google-calendar.mock.ts
│       ├── resend.mock.ts
│       └── next-router.mock.ts
├── jest.config.js
├── jest.setup.js
└── ... (existing files)
```

### Jest Configuration Template

```javascript
// jest.config.js
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: [
    '**/__tests__/**/*.test.ts',
    '**/__tests__/**/*.test.tsx',
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.tsx',
  ],
}

module.exports = createJestConfig(customJestConfig)
```

### Next Steps

1. [ ] Install test dependencies
2. [ ] Create Jest/Vitest configuration
3. [ ] Create mock utilities for external services
4. [ ] Write tests for validation schemas (easiest, no mocking needed)
5. [ ] Write tests for hooks
6. [ ] Write tests for API routes
7. [ ] Write tests for components
8. [ ] Set up CI/CD integration
9. [ ] Aim for 80%+ code coverage

---

For detailed information, see `CODEBASE_EXPLORATION.md`
