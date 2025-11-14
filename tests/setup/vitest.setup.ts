import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll, afterAll, vi } from 'vitest';
import { server } from './msw-server';

// Configurar MSW (Mock Service Worker)
beforeAll(() => {
  server.listen({
    onUnhandledRequest: 'warn',
  });
});

afterEach(() => {
  // Limpiar después de cada prueba
  cleanup();
  server.resetHandlers();
  vi.clearAllMocks();
});

afterAll(() => {
  server.close();
});

// Mock de Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
}));

// Mock de Next.js Image
vi.mock('next/image', () => ({
  default: (props: any) => props,
}));

// Mock de variables de entorno
process.env.GOOGLE_CALENDAR_ID = 'test-calendar-id';
process.env.GOOGLE_CLIENT_EMAIL = 'test@test.iam.gserviceaccount.com';
process.env.GOOGLE_PRIVATE_KEY = '-----BEGIN PRIVATE KEY-----\nTEST_KEY\n-----END PRIVATE KEY-----';
process.env.RESEND_API_KEY = 're_test_key';
process.env.REGISTRO_EMAIL_TO = 'test@example.com';
process.env.NEXT_PUBLIC_SITE_URL = 'http://localhost:3000';

// Configuración global para fetch
global.fetch = vi.fn();
