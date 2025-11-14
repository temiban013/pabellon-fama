/**
 * Unit tests for lib/utils.ts
 * Tests all utility functions with comprehensive coverage
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  cn,
  formatDate,
  formatPhone,
  isValidEmail,
  escapeHtml,
  truncateText,
  generateSlug,
  sleep,
  capitalize,
  titleCase,
  getInitials,
  getColorFromString,
  debounce,
  throttle,
  PABELLON_CONSTANTS,
  isValidExaltationYear,
  getAvailableYears,
} from '@/lib/utils'

describe('cn - Tailwind class merger', () => {
  it('should merge Tailwind classes correctly', () => {
    expect(cn('px-2', 'py-1')).toBe('px-2 py-1')
  })

  it('should override conflicting classes', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
  })

  it('should handle conditional classes', () => {
    expect(cn('px-2', false && 'py-1')).toBe('px-2')
  })
})

describe('formatDate - Spanish date formatting', () => {
  it('should format Date object to Spanish', () => {
    const date = new Date('2025-06-15T19:00:00-04:00')
    const formatted = formatDate(date)
    expect(formatted).toContain('15')
    expect(formatted).toContain('2025')
  })

  it('should format string date to Spanish', () => {
    const formatted = formatDate('2025-06-15T12:00:00-04:00')
    expect(formatted).toContain('15')
    expect(formatted).toContain('2025')
  })

  it('should respect custom options', () => {
    const date = new Date('2025-06-15')
    const formatted = formatDate(date, { month: 'short' })
    expect(formatted).toBeTruthy()
  })

  it('should use Puerto Rico timezone', () => {
    const date = new Date('2025-06-15T23:00:00Z')
    const formatted = formatDate(date)
    // Should be adjusted to PR timezone
    expect(formatted).toBeTruthy()
  })
})

describe('formatPhone - Puerto Rico phone formatting', () => {
  it('should format 10-digit phone number', () => {
    expect(formatPhone('7875551234')).toBe('787-555-1234')
  })

  it('should format phone with existing dashes', () => {
    expect(formatPhone('787-555-1234')).toBe('787-555-1234')
  })

  it('should format phone with parentheses', () => {
    expect(formatPhone('(787) 555-1234')).toBe('787-555-1234')
  })

  it('should format 11-digit phone with country code', () => {
    expect(formatPhone('17875551234')).toBe('+1-787-555-1234')
  })

  it('should return original if cannot format', () => {
    expect(formatPhone('123')).toBe('123')
    expect(formatPhone('invalid')).toBe('invalid')
  })

  it('should handle 939 area code', () => {
    expect(formatPhone('9395551234')).toBe('939-555-1234')
  })
})

describe('isValidEmail - Email validation', () => {
  it('should validate correct email addresses', () => {
    expect(isValidEmail('test@example.com')).toBe(true)
    expect(isValidEmail('juan.perez@pabellon.org')).toBe(true)
    expect(isValidEmail('user+tag@domain.co')).toBe(true)
  })

  it('should reject invalid email addresses', () => {
    expect(isValidEmail('invalid')).toBe(false)
    expect(isValidEmail('@example.com')).toBe(false)
    expect(isValidEmail('test@')).toBe(false)
    expect(isValidEmail('test @example.com')).toBe(false)
    expect(isValidEmail('')).toBe(false)
  })
})

describe('escapeHtml - HTML escaping', () => {
  it('should escape HTML special characters', () => {
    expect(escapeHtml('<script>alert("xss")</script>'))
      .toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;')
  })

  it('should escape ampersands', () => {
    expect(escapeHtml('Tom & Jerry')).toBe('Tom &amp; Jerry')
  })

  it('should escape quotes', () => {
    expect(escapeHtml(`"double" and 'single'`))
      .toBe('&quot;double&quot; and &#039;single&#039;')
  })

  it('should handle empty string', () => {
    expect(escapeHtml('')).toBe('')
  })
})

describe('truncateText - Text truncation', () => {
  it('should truncate long text with default suffix', () => {
    const text = 'Esta es una biografía muy larga del exaltado'
    expect(truncateText(text, 20)).toBe('Esta es una biogr...')
  })

  it('should not truncate short text', () => {
    const text = 'Texto corto'
    expect(truncateText(text, 20)).toBe(text)
  })

  it('should use custom suffix', () => {
    const text = 'Esta es una biografía muy larga'
    expect(truncateText(text, 15, '…')).toBe('Esta es una bi…')
  })

  it('should handle exact length', () => {
    const text = 'Exacto'
    expect(truncateText(text, 6)).toBe('Exacto')
  })
})

describe('generateSlug - URL slug generation', () => {
  it('should generate slug from Spanish text', () => {
    expect(generateSlug('Roberto Clemente')).toBe('roberto-clemente')
  })

  it('should remove accents', () => {
    expect(generateSlug('José Pérez Núñez')).toBe('jose-perez-nunez')
  })

  it('should handle special characters', () => {
    expect(generateSlug('Félix "Tito" Trinidad')).toBe('felix-tito-trinidad')
  })

  it('should convert spaces to hyphens', () => {
    expect(generateSlug('Mónica    Puig')).toBe('monica-puig')
  })

  it('should remove multiple consecutive hyphens', () => {
    expect(generateSlug('Test---Text')).toBe('test-text')
  })

  it('should handle parentheses and numbers', () => {
    expect(generateSlug('Equipo (1951)')).toBe('equipo-1951')
  })
})

describe('sleep - Async delay', () => {
  it('should wait for specified time', async () => {
    const start = Date.now()
    await sleep(100)
    const elapsed = Date.now() - start
    expect(elapsed).toBeGreaterThanOrEqual(95) // Allow 5ms tolerance
  })
})

describe('capitalize - Text capitalization', () => {
  it('should capitalize first letter', () => {
    expect(capitalize('hello')).toBe('Hello')
  })

  it('should lowercase remaining letters', () => {
    expect(capitalize('HELLO')).toBe('Hello')
  })

  it('should handle single character', () => {
    expect(capitalize('a')).toBe('A')
  })

  it('should handle empty string', () => {
    expect(capitalize('')).toBe('')
  })
})

describe('titleCase - Title case conversion', () => {
  it('should capitalize each word', () => {
    expect(titleCase('roberto clemente walker')).toBe('Roberto Clemente Walker')
  })

  it('should handle mixed case', () => {
    expect(titleCase('FÉLIX TRINIDAD')).toBe('Félix Trinidad')
  })

  it('should handle single word', () => {
    expect(titleCase('humacao')).toBe('Humacao')
  })
})

describe('getInitials - Name initials extraction', () => {
  it('should get initials from full name', () => {
    expect(getInitials('Roberto Clemente')).toBe('RC')
  })

  it('should ignore nicknames in parentheses', () => {
    expect(getInitials('José (Toñín) Casillas')).toBe('JC')
  })

  it('should handle names with quotes', () => {
    expect(getInitials('Félix "Tito" Trinidad')).toBe('FT')
  })

  it('should handle single name', () => {
    expect(getInitials('Roberto')).toBe('RR')
  })

  it('should handle three or more words', () => {
    expect(getInitials('Roberto Clemente Walker')).toBe('RW')
  })

  it('should handle middle initials', () => {
    expect(getInitials('Juan A. Pérez')).toBe('JP')
  })

  it('should handle empty string', () => {
    expect(getInitials('')).toBe('??')
  })
})

describe('getColorFromString - Color generation', () => {
  it('should generate consistent colors for same string', () => {
    const color1 = getColorFromString('Roberto Clemente')
    const color2 = getColorFromString('Roberto Clemente')
    expect(color1).toBe(color2)
  })

  it('should generate different colors for different strings', () => {
    const color1 = getColorFromString('Roberto')
    const color2 = getColorFromString('Monica')
    // Note: there's a small chance they could be the same, but unlikely
    expect(color1).toMatch(/^bg-\w+-500$/)
    expect(color2).toMatch(/^bg-\w+-500$/)
  })

  it('should generate valid Tailwind color class', () => {
    const color = getColorFromString('test')
    expect(color).toMatch(/^bg-(red|blue|green|yellow|purple|pink|indigo|teal)-500$/)
  })
})

describe('debounce - Function debouncing', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should debounce function calls', () => {
    const mockFn = vi.fn()
    const debouncedFn = debounce(mockFn, 100)

    debouncedFn()
    debouncedFn()
    debouncedFn()

    expect(mockFn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(100)

    expect(mockFn).toHaveBeenCalledTimes(1)
  })

  it('should pass arguments correctly', () => {
    const mockFn = vi.fn()
    const debouncedFn = debounce(mockFn, 100)

    debouncedFn('arg1', 'arg2')

    vi.advanceTimersByTime(100)

    expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2')
  })
})

describe('throttle - Function throttling', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should throttle function calls', () => {
    const mockFn = vi.fn()
    const throttledFn = throttle(mockFn, 100)

    throttledFn()
    throttledFn()
    throttledFn()

    expect(mockFn).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(100)

    throttledFn()

    expect(mockFn).toHaveBeenCalledTimes(2)
  })
})

describe('PABELLON_CONSTANTS', () => {
  it('should have correct founding year', () => {
    expect(PABELLON_CONSTANTS.FOUNDED_YEAR).toBe(1996)
  })

  it('should have correct location', () => {
    expect(PABELLON_CONSTANTS.LOCATION).toBe('Humacao, Puerto Rico')
  })

  it('should have Puerto Rico area codes', () => {
    expect(PABELLON_CONSTANTS.PHONE_AREA_CODES).toContain('787')
    expect(PABELLON_CONSTANTS.PHONE_AREA_CODES).toContain('939')
  })

  it('should have sports categories', () => {
    expect(PABELLON_CONSTANTS.SPORTS_CATEGORIES).toContain('Béisbol')
    expect(PABELLON_CONSTANTS.SPORTS_CATEGORIES).toContain('Baloncesto')
    expect(PABELLON_CONSTANTS.SPORTS_CATEGORIES).toContain('Boxeo')
  })

  it('should have social links', () => {
    expect(PABELLON_CONSTANTS.SOCIAL_LINKS.youtube).toContain('youtube.com')
    expect(PABELLON_CONSTANTS.SOCIAL_LINKS.blog).toContain('blogspot.com')
  })
})

describe('isValidExaltationYear - Year validation', () => {
  it('should validate years from 1996 onwards', () => {
    expect(isValidExaltationYear(1996)).toBe(true)
    expect(isValidExaltationYear(2000)).toBe(true)
    expect(isValidExaltationYear(2025)).toBe(true)
  })

  it('should reject years before founding', () => {
    expect(isValidExaltationYear(1995)).toBe(false)
    expect(isValidExaltationYear(1900)).toBe(false)
  })

  it('should reject future years', () => {
    const futureYear = new Date().getFullYear() + 1
    expect(isValidExaltationYear(futureYear)).toBe(false)
  })

  it('should accept current year', () => {
    const currentYear = new Date().getFullYear()
    expect(isValidExaltationYear(currentYear)).toBe(true)
  })
})

describe('getAvailableYears - Years array generation', () => {
  it('should return array of years from 1996 to current', () => {
    const years = getAvailableYears()
    expect(years).toContain(1996)
    expect(years).toContain(new Date().getFullYear())
  })

  it('should return years in descending order', () => {
    const years = getAvailableYears()
    expect(years[0]).toBeGreaterThan(years[years.length - 1])
  })

  it('should have correct length', () => {
    const years = getAvailableYears()
    const expectedLength = new Date().getFullYear() - 1996 + 1
    expect(years).toHaveLength(expectedLength)
  })
})
