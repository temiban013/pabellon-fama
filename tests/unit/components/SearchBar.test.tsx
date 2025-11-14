/**
 * Unit tests for components/directorio/SearchBar.tsx
 * Tests search functionality with Spanish locale
 */
import { describe, it, expect, vi } from 'vitest'
import { render, screen, setupUser } from '../../setup/test-utils'
import { SearchBar } from '@/components/directorio/SearchBar'

describe('SearchBar Component', () => {
  const defaultProps = {
    value: '',
    onChange: vi.fn(),
  }

  it('should render search input', () => {
    render(<SearchBar {...defaultProps} />)

    const input = screen.getByRole('textbox')
    expect(input).toBeInTheDocument()
  })

  it('should display default placeholder in Spanish', () => {
    render(<SearchBar {...defaultProps} />)

    const input = screen.getByPlaceholderText('Buscar exaltados...')
    expect(input).toBeInTheDocument()
  })

  it('should display custom placeholder', () => {
    render(<SearchBar {...defaultProps} placeholder="Buscar atletas" />)

    const input = screen.getByPlaceholderText('Buscar atletas')
    expect(input).toBeInTheDocument()
  })

  it('should display help text in Spanish', () => {
    render(<SearchBar {...defaultProps} />)

    expect(screen.getByText(/Busca por nombre, deporte, categoría o biografía/i)).toBeInTheDocument()
  })

  it('should display search icon', () => {
    render(<SearchBar {...defaultProps} />)

    // MagnifyingGlassIcon is rendered
    const searchIcon = document.querySelector('svg')
    expect(searchIcon).toBeInTheDocument()
  })

  it('should call onChange when typing', async () => {
    const user = setupUser()
    const onChange = vi.fn()

    render(<SearchBar value="" onChange={onChange} />)

    const input = screen.getByRole('textbox')
    await user.type(input, 'Roberto')

    expect(onChange).toHaveBeenCalled()
    expect(onChange).toHaveBeenLastCalledWith('Roberto')
  })

  it('should display current value', () => {
    render(<SearchBar value="Roberto Clemente" onChange={vi.fn()} />)

    const input = screen.getByRole('textbox') as HTMLInputElement
    expect(input.value).toBe('Roberto Clemente')
  })

  it('should show clear button when there is a value', () => {
    render(<SearchBar value="Roberto" onChange={vi.fn()} />)

    const clearButton = screen.getByLabelText('Limpiar búsqueda')
    expect(clearButton).toBeInTheDocument()
  })

  it('should not show clear button when value is empty', () => {
    render(<SearchBar value="" onChange={vi.fn()} />)

    const clearButton = screen.queryByLabelText('Limpiar búsqueda')
    expect(clearButton).not.toBeInTheDocument()
  })

  it('should clear input when clear button is clicked', async () => {
    const user = setupUser()
    const onChange = vi.fn()

    render(<SearchBar value="Roberto" onChange={onChange} />)

    const clearButton = screen.getByLabelText('Limpiar búsqueda')
    await user.click(clearButton)

    expect(onChange).toHaveBeenCalledWith('')
  })

  it('should handle Spanish characters', async () => {
    const user = setupUser()
    const onChange = vi.fn()

    render(<SearchBar value="" onChange={onChange} />)

    const input = screen.getByRole('textbox')
    await user.type(input, 'José Pérez')

    expect(onChange).toHaveBeenCalled()
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0]
    expect(lastCall).toContain('z') // Last character typed
  })

  it('should handle ñ character', async () => {
    const user = setupUser()
    const onChange = vi.fn()

    render(<SearchBar value="" onChange={onChange} />)

    const input = screen.getByRole('textbox')
    await user.type(input, 'Peña')

    expect(onChange).toHaveBeenCalled()
  })

  it('should apply custom className', () => {
    const { container } = render(
      <SearchBar {...defaultProps} className="custom-class" />
    )

    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.className).toContain('custom-class')
  })

  it('should have autocomplete off', () => {
    render(<SearchBar {...defaultProps} />)

    const input = screen.getByRole('textbox') as HTMLInputElement
    expect(input.autocomplete).toBe('off')
  })

  it('should have spellcheck disabled', () => {
    render(<SearchBar {...defaultProps} />)

    const input = screen.getByRole('textbox') as HTMLInputElement
    expect(input.spellcheck).toBe(false)
  })

  it('should handle focus state', async () => {
    const user = setupUser()

    render(<SearchBar {...defaultProps} />)

    const input = screen.getByRole('textbox')

    // Focus the input
    await user.click(input)

    // Input should be focused
    expect(input).toHaveFocus()
  })

  it('should handle blur state', async () => {
    const user = setupUser()

    render(<SearchBar {...defaultProps} />)

    const input = screen.getByRole('textbox')

    // Focus then blur
    await user.click(input)
    await user.tab() // Move focus away

    // Input should no longer be focused
    expect(input).not.toHaveFocus()
  })

  it('should update when value prop changes', () => {
    const { rerender } = render(<SearchBar value="Initial" onChange={vi.fn()} />)

    let input = screen.getByRole('textbox') as HTMLInputElement
    expect(input.value).toBe('Initial')

    rerender(<SearchBar value="Updated" onChange={vi.fn()} />)

    input = screen.getByRole('textbox') as HTMLInputElement
    expect(input.value).toBe('Updated')
  })

  it('should clear button be accessible', () => {
    render(<SearchBar value="Roberto" onChange={vi.fn()} />)

    const clearButton = screen.getByLabelText('Limpiar búsqueda')
    expect(clearButton).toHaveAttribute('type', 'button')
    expect(clearButton).toHaveAttribute('aria-label', 'Limpiar búsqueda')
  })

  it('should handle rapid typing', async () => {
    const user = setupUser()
    const onChange = vi.fn()

    render(<SearchBar value="" onChange={onChange} />)

    const input = screen.getByRole('textbox')
    await user.type(input, 'Roberto Clemente Walker')

    // Should have been called for each character
    expect(onChange.mock.calls.length).toBeGreaterThan(15)
  })

  it('should handle empty string after having value', async () => {
    const user = setupUser()
    const onChange = vi.fn()

    render(<SearchBar value="Test" onChange={onChange} />)

    const clearButton = screen.getByLabelText('Limpiar búsqueda')
    await user.click(clearButton)

    expect(onChange).toHaveBeenCalledWith('')
  })

  it('should maintain focus after typing', async () => {
    const user = setupUser()

    render(<SearchBar {...defaultProps} />)

    const input = screen.getByRole('textbox')
    await user.click(input)
    await user.type(input, 'test')

    expect(input).toHaveFocus()
  })

  it('should work with controlled component pattern', () => {
    const { rerender } = render(<SearchBar value="" onChange={vi.fn()} />)

    let input = screen.getByRole('textbox') as HTMLInputElement
    expect(input.value).toBe('')

    // Simulate parent component updating the value
    rerender(<SearchBar value="R" onChange={vi.fn()} />)
    expect(input.value).toBe('R')

    rerender(<SearchBar value="Ro" onChange={vi.fn()} />)
    expect(input.value).toBe('Ro')

    rerender(<SearchBar value="Rob" onChange={vi.fn()} />)
    expect(input.value).toBe('Rob')
  })
})
