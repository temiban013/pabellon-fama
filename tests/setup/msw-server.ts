import { setupServer } from 'msw/node'
import { handlers } from './msw-handlers'

/**
 * MSW server for mocking API requests in tests
 * This runs in Node.js environment for Vitest tests
 */
export const server = setupServer(...handlers)
