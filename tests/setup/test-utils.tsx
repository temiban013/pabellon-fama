import { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

/**
 * Custom render function that wraps components with necessary providers
 * Extend this as needed for context providers, theme providers, etc.
 */
function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { ...options })
}

/**
 * Setup userEvent with default configuration
 */
export function setupUser() {
  return userEvent.setup()
}

// Re-export everything from Testing Library
export * from '@testing-library/react'
export { customRender as render }
