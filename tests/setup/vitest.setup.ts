import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeAll, afterAll, vi } from 'vitest'
import { server } from './msw-server'

// Start MSW server before all tests
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'warn' })
})

// Reset handlers and cleanup after each test
afterEach(() => {
  cleanup()
  server.resetHandlers()
  vi.clearAllMocks()
})

// Close MSW server after all tests
afterAll(() => {
  server.close()
})

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
  })),
  usePathname: vi.fn(() => '/'),
  useSearchParams: vi.fn(() => new URLSearchParams()),
  useParams: vi.fn(() => ({})),
  notFound: vi.fn(),
  redirect: vi.fn(),
}))

// Mock Next.js Image component
vi.mock('next/image', () => ({
  default: vi.fn((props) => props),
}))

// Mock environment variables
process.env.NEXT_PUBLIC_SITE_URL = 'https://pabellonfamahr.org'
process.env.GOOGLE_CALENDAR_ID = 'test-calendar-id@group.calendar.google.com'
process.env.RESEND_API_KEY = 'test-resend-key'
