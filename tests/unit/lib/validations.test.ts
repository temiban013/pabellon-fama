/**
 * Unit tests for lib/validations.ts
 * Tests Zod schemas for form validation
 */
import { describe, it, expect } from 'vitest'
import {
  registroSchema,
  registroApiSchema,
  validateRegistro,
  validateRegistroApi,
  emailResponseSchema,
} from '@/lib/validations'

describe('registroSchema - Form validation schema', () => {
  describe('email field', () => {
    it('should accept valid email', () => {
      const result = registroSchema.safeParse({
        email: 'juan.perez@example.com',
        interes: 'general',
      })
      expect(result.success).toBe(true)
    })

    it('should reject empty email', () => {
      const result = registroSchema.safeParse({
        email: '',
        interes: 'general',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('email es requerido')
      }
    })

    it('should reject invalid email format', () => {
      const result = registroSchema.safeParse({
        email: 'invalid-email',
        interes: 'general',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Formato de email inválido')
      }
    })

    it('should reject email over 255 characters', () => {
      const longEmail = 'a'.repeat(250) + '@test.com'
      const result = registroSchema.safeParse({
        email: longEmail,
        interes: 'general',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('demasiado largo')
      }
    })
  })

  describe('nombre field', () => {
    it('should accept valid Spanish names', () => {
      const result = registroSchema.safeParse({
        email: 'test@example.com',
        nombre: 'José Pérez',
        interes: 'general',
      })
      expect(result.success).toBe(true)
    })

    it('should accept names with accents', () => {
      const result = registroSchema.safeParse({
        email: 'test@example.com',
        nombre: 'María José García',
        interes: 'general',
      })
      expect(result.success).toBe(true)
    })

    it('should accept names with ñ', () => {
      const result = registroSchema.safeParse({
        email: 'test@example.com',
        nombre: 'Peña Núñez',
        interes: 'general',
      })
      expect(result.success).toBe(true)
    })

    it('should accept empty string (optional)', () => {
      const result = registroSchema.safeParse({
        email: 'test@example.com',
        nombre: '',
        interes: 'general',
      })
      expect(result.success).toBe(true)
    })

    it('should accept undefined (optional)', () => {
      const result = registroSchema.safeParse({
        email: 'test@example.com',
        interes: 'general',
      })
      expect(result.success).toBe(true)
    })

    it('should reject names shorter than 2 characters', () => {
      const result = registroSchema.safeParse({
        email: 'test@example.com',
        nombre: 'A',
        interes: 'general',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('al menos 2 caracteres')
      }
    })

    it('should reject names over 100 characters', () => {
      const result = registroSchema.safeParse({
        email: 'test@example.com',
        nombre: 'A'.repeat(101),
        interes: 'general',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('demasiado largo')
      }
    })

    it('should reject names with numbers', () => {
      const result = registroSchema.safeParse({
        email: 'test@example.com',
        nombre: 'José123',
        interes: 'general',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Solo letras y espacios')
      }
    })

    it('should reject names with special characters', () => {
      const result = registroSchema.safeParse({
        email: 'test@example.com',
        nombre: 'José@Pérez',
        interes: 'general',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('telefono field', () => {
    it('should accept valid Puerto Rico phone format', () => {
      const result = registroSchema.safeParse({
        email: 'test@example.com',
        telefono: '787-555-1234',
        interes: 'general',
      })
      expect(result.success).toBe(true)
    })

    it('should accept phone with area code in parentheses', () => {
      const result = registroSchema.safeParse({
        email: 'test@example.com',
        telefono: '(787)555-1234',
        interes: 'general',
      })
      expect(result.success).toBe(true)
    })

    it('should accept phone with +1 country code', () => {
      const result = registroSchema.safeParse({
        email: 'test@example.com',
        telefono: '+1-787-555-1234',
        interes: 'general',
      })
      expect(result.success).toBe(true)
    })

    it('should accept phone without dashes', () => {
      const result = registroSchema.safeParse({
        email: 'test@example.com',
        telefono: '7875551234',
        interes: 'general',
      })
      expect(result.success).toBe(true)
    })

    it('should accept empty string (optional)', () => {
      const result = registroSchema.safeParse({
        email: 'test@example.com',
        telefono: '',
        interes: 'general',
      })
      expect(result.success).toBe(true)
    })

    it('should accept undefined (optional)', () => {
      const result = registroSchema.safeParse({
        email: 'test@example.com',
        interes: 'general',
      })
      expect(result.success).toBe(true)
    })

    it('should reject invalid phone format', () => {
      const result = registroSchema.safeParse({
        email: 'test@example.com',
        telefono: '123',
        interes: 'general',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Formato de teléfono inválido')
      }
    })
  })

  describe('interes field', () => {
    it('should accept "visitante"', () => {
      const result = registroSchema.safeParse({
        email: 'test@example.com',
        interes: 'visitante',
      })
      expect(result.success).toBe(true)
    })

    it('should accept "voluntario"', () => {
      const result = registroSchema.safeParse({
        email: 'test@example.com',
        interes: 'voluntario',
      })
      expect(result.success).toBe(true)
    })

    it('should accept "investigador"', () => {
      const result = registroSchema.safeParse({
        email: 'test@example.com',
        interes: 'investigador',
      })
      expect(result.success).toBe(true)
    })

    it('should accept "general"', () => {
      const result = registroSchema.safeParse({
        email: 'test@example.com',
        interes: 'general',
      })
      expect(result.success).toBe(true)
    })

    it('should reject invalid interes value', () => {
      const result = registroSchema.safeParse({
        email: 'test@example.com',
        interes: 'invalid',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('interés válido')
      }
    })

    it('should require interes field', () => {
      const result = registroSchema.safeParse({
        email: 'test@example.com',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('mensaje field', () => {
    it('should accept valid mensaje', () => {
      const result = registroSchema.safeParse({
        email: 'test@example.com',
        mensaje: 'Me gustaría obtener más información.',
        interes: 'general',
      })
      expect(result.success).toBe(true)
    })

    it('should accept empty string (optional)', () => {
      const result = registroSchema.safeParse({
        email: 'test@example.com',
        mensaje: '',
        interes: 'general',
      })
      expect(result.success).toBe(true)
    })

    it('should accept undefined (optional)', () => {
      const result = registroSchema.safeParse({
        email: 'test@example.com',
        interes: 'general',
      })
      expect(result.success).toBe(true)
    })

    it('should reject mensaje over 500 characters', () => {
      const result = registroSchema.safeParse({
        email: 'test@example.com',
        mensaje: 'A'.repeat(501),
        interes: 'general',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('no puede exceder 500')
      }
    })

    it('should accept mensaje with exactly 500 characters', () => {
      const result = registroSchema.safeParse({
        email: 'test@example.com',
        mensaje: 'A'.repeat(500),
        interes: 'general',
      })
      expect(result.success).toBe(true)
    })
  })

  describe('complete form validation', () => {
    it('should accept complete valid form', () => {
      const result = registroSchema.safeParse({
        email: 'juan.perez@example.com',
        nombre: 'Juan Pérez',
        telefono: '787-555-1234',
        interes: 'voluntario',
        mensaje: 'Me gustaría colaborar con el Pabellón.',
      })
      expect(result.success).toBe(true)
    })

    it('should accept minimal valid form', () => {
      const result = registroSchema.safeParse({
        email: 'test@example.com',
        interes: 'general',
      })
      expect(result.success).toBe(true)
    })
  })
})

describe('registroApiSchema - API validation schema', () => {
  it('should require nombre field', () => {
    const result = registroApiSchema.safeParse({
      email: 'test@example.com',
      interes: 'general',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('nombre es requerido')
    }
  })

  it('should reject empty nombre', () => {
    const result = registroApiSchema.safeParse({
      email: 'test@example.com',
      nombre: '',
      interes: 'general',
    })
    expect(result.success).toBe(false)
  })

  it('should accept valid API input', () => {
    const result = registroApiSchema.safeParse({
      email: 'juan.perez@example.com',
      nombre: 'Juan Pérez',
      telefono: '787-555-1234',
      interes: 'voluntario',
      mensaje: 'Me gustaría colaborar.',
    })
    expect(result.success).toBe(true)
  })

  it('should be stricter than registroSchema', () => {
    const data = {
      email: 'test@example.com',
      interes: 'general',
    }

    const formResult = registroSchema.safeParse(data)
    const apiResult = registroApiSchema.safeParse(data)

    expect(formResult.success).toBe(true)
    expect(apiResult.success).toBe(false)
  })
})

describe('validateRegistro - Helper function', () => {
  it('should validate valid data', () => {
    const result = validateRegistro({
      email: 'test@example.com',
      interes: 'general',
    })
    expect(result.success).toBe(true)
  })

  it('should reject invalid data', () => {
    const result = validateRegistro({
      email: 'invalid',
      interes: 'general',
    })
    expect(result.success).toBe(false)
  })

  it('should handle unknown data types', () => {
    const result = validateRegistro(null)
    expect(result.success).toBe(false)
  })
})

describe('validateRegistroApi - Helper function', () => {
  it('should validate valid API data', () => {
    const result = validateRegistroApi({
      email: 'test@example.com',
      nombre: 'Juan Pérez',
      interes: 'general',
    })
    expect(result.success).toBe(true)
  })

  it('should reject data without nombre', () => {
    const result = validateRegistroApi({
      email: 'test@example.com',
      interes: 'general',
    })
    expect(result.success).toBe(false)
  })

  it('should handle unknown data types', () => {
    const result = validateRegistroApi(undefined)
    expect(result.success).toBe(false)
  })
})

describe('emailResponseSchema - Email response validation', () => {
  it('should accept valid success response', () => {
    const result = emailResponseSchema.safeParse({
      success: true,
      message: 'Email enviado exitosamente',
      data: {
        id: 'reg-123',
        email: 'test@example.com',
        fechaRegistro: '2025-06-15T19:00:00Z',
      },
    })
    expect(result.success).toBe(true)
  })

  it('should accept response without data', () => {
    const result = emailResponseSchema.safeParse({
      success: true,
      message: 'Email enviado',
    })
    expect(result.success).toBe(true)
  })

  it('should accept error response', () => {
    const result = emailResponseSchema.safeParse({
      success: false,
      message: 'Error al enviar email',
    })
    expect(result.success).toBe(true)
  })

  it('should require success field', () => {
    const result = emailResponseSchema.safeParse({
      message: 'Test',
    })
    expect(result.success).toBe(false)
  })

  it('should require message field', () => {
    const result = emailResponseSchema.safeParse({
      success: true,
    })
    expect(result.success).toBe(false)
  })

  it('should validate data.email format', () => {
    const result = emailResponseSchema.safeParse({
      success: true,
      message: 'Email enviado',
      data: {
        id: 'reg-123',
        email: 'invalid-email',
        fechaRegistro: '2025-06-15T19:00:00Z',
      },
    })
    expect(result.success).toBe(false)
  })

  it('should validate data.fechaRegistro as datetime', () => {
    const result = emailResponseSchema.safeParse({
      success: true,
      message: 'Email enviado',
      data: {
        id: 'reg-123',
        email: 'test@example.com',
        fechaRegistro: 'invalid-date',
      },
    })
    expect(result.success).toBe(false)
  })
})
