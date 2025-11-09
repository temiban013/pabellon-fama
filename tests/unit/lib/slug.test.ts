/**
 * Unit tests for lib/utils/slug.ts
 * Tests SEO-friendly slug generation for exaltados
 */
import { describe, it, expect } from 'vitest'
import {
  generateExaltadoSlug,
  isSemanticSlug,
  generateSlugs,
} from '@/lib/utils/slug'

describe('generateExaltadoSlug - SEO slug generation', () => {
  it('should generate slug from nombre and apellidos', () => {
    const slug = generateExaltadoSlug('Roberto', 'Clemente')
    expect(slug).toBe('roberto-clemente')
  })

  it('should handle Spanish accents', () => {
    const slug = generateExaltadoSlug('José', 'Pérez')
    expect(slug).toBe('jose-perez')
  })

  it('should handle nicknames in parentheses', () => {
    const slug = generateExaltadoSlug('José (Toñín)', 'Casillas')
    expect(slug).toBe('jose-tonin-casillas')
  })

  it('should handle quotes in names', () => {
    const slug = generateExaltadoSlug('Félix "Tito"', 'Trinidad')
    expect(slug).toBe('felix-tito-trinidad')
  })

  it('should handle team names with years', () => {
    const slug = generateExaltadoSlug('Equipo Humacao', '(1951)')
    expect(slug).toBe('equipo-humacao-1951')
  })

  it('should handle multiple spaces', () => {
    const slug = generateExaltadoSlug('Roberto   Clemente', 'Walker')
    expect(slug).toBe('roberto-clemente-walker')
  })

  it('should handle names with middle names', () => {
    const slug = generateExaltadoSlug('Juan A.', 'Pérez Martínez')
    expect(slug).toBe('juan-a-perez-martinez')
  })

  it('should remove special characters', () => {
    const slug = generateExaltadoSlug('José*', 'Pérez!')
    expect(slug).toBe('jose-perez')
  })

  it('should handle all lowercase', () => {
    const slug = generateExaltadoSlug('roberto', 'clemente')
    expect(slug).toBe('roberto-clemente')
  })

  it('should handle all uppercase', () => {
    const slug = generateExaltadoSlug('ROBERTO', 'CLEMENTE')
    expect(slug).toBe('roberto-clemente')
  })

  it('should trim leading/trailing hyphens', () => {
    const slug = generateExaltadoSlug('-Roberto-', '-Clemente-')
    expect(slug).toBe('roberto-clemente')
  })

  it('should deduplicate consecutive hyphens', () => {
    const slug = generateExaltadoSlug('Roberto--', '--Clemente')
    expect(slug).toBe('roberto-clemente')
  })

  it('should handle empty strings with fallback', () => {
    const slug = generateExaltadoSlug('', '')
    expect(slug).toBe('exaltado')
  })

  it('should handle ñ character', () => {
    const slug = generateExaltadoSlug('Peña', 'Núñez')
    expect(slug).toBe('pena-nunez')
  })

  it('should handle complex Spanish names', () => {
    const slug = generateExaltadoSlug('María José', 'García López')
    expect(slug).toBe('maria-jose-garcia-lopez')
  })

  it('should handle names with single letters', () => {
    const slug = generateExaltadoSlug('A.', 'B.')
    expect(slug).toBe('a-b')
  })
})

describe('isSemanticSlug - Slug format validation', () => {
  it('should identify semantic slugs', () => {
    expect(isSemanticSlug('roberto-clemente')).toBe(true)
    expect(isSemanticSlug('jose-perez')).toBe(true)
    expect(isSemanticSlug('felix-tito-trinidad')).toBe(true)
  })

  it('should identify old-format slugs', () => {
    expect(isSemanticSlug('exaltado-rev01-001')).toBe(false)
    expect(isSemanticSlug('exaltado-rev02-042')).toBe(false)
  })

  it('should handle edge cases', () => {
    expect(isSemanticSlug('')).toBe(true)
    expect(isSemanticSlug('exaltado')).toBe(true)
    expect(isSemanticSlug('rev-something')).toBe(true)
  })
})

describe('generateSlugs - Batch slug generation', () => {
  it('should generate slugs for multiple exaltados', () => {
    const exaltados = [
      { nombre: 'Roberto', apellidos: 'Clemente' },
      { nombre: 'Mónica', apellidos: 'Puig' },
      { nombre: 'Carlos', apellidos: 'Arroyo' },
    ]

    const slugs = generateSlugs(exaltados)

    expect(slugs.get('roberto-clemente')).toBe('roberto-clemente')
    expect(slugs.get('monica-puig')).toBe('monica-puig')
    expect(slugs.get('carlos-arroyo')).toBe('carlos-arroyo')
    expect(slugs.size).toBe(3)
  })

  it('should handle duplicate names by adding numbers', () => {
    const exaltados = [
      { nombre: 'José', apellidos: 'Pérez' },
      { nombre: 'José', apellidos: 'Pérez' },
      { nombre: 'José', apellidos: 'Pérez' },
    ]

    const slugs = generateSlugs(exaltados)

    expect(slugs.get('jose-perez')).toBe('jose-perez')
    expect(slugs.get('jose-perez-2')).toBe('jose-perez')
    expect(slugs.get('jose-perez-3')).toBe('jose-perez')
    expect(slugs.size).toBe(3)
  })

  it('should handle empty array', () => {
    const slugs = generateSlugs([])
    expect(slugs.size).toBe(0)
  })

  it('should handle single exaltado', () => {
    const exaltados = [
      { nombre: 'Roberto', apellidos: 'Clemente' },
    ]

    const slugs = generateSlugs(exaltados)

    expect(slugs.get('roberto-clemente')).toBe('roberto-clemente')
    expect(slugs.size).toBe(1)
  })

  it('should handle mix of unique and duplicate names', () => {
    const exaltados = [
      { nombre: 'Roberto', apellidos: 'Clemente' },
      { nombre: 'José', apellidos: 'Pérez' },
      { nombre: 'José', apellidos: 'Pérez' },
      { nombre: 'Mónica', apellidos: 'Puig' },
    ]

    const slugs = generateSlugs(exaltados)

    expect(slugs.size).toBe(4)
    expect(slugs.get('roberto-clemente')).toBe('roberto-clemente')
    expect(slugs.get('jose-perez')).toBe('jose-perez')
    expect(slugs.get('jose-perez-2')).toBe('jose-perez')
    expect(slugs.get('monica-puig')).toBe('monica-puig')
  })

  it('should preserve generation order', () => {
    const exaltados = [
      { nombre: 'First', apellidos: 'Person' },
      { nombre: 'Second', apellidos: 'Person' },
      { nombre: 'Third', apellidos: 'Person' },
    ]

    const slugs = generateSlugs(exaltados)
    const keys = Array.from(slugs.keys())

    expect(keys[0]).toBe('first-person')
    expect(keys[1]).toBe('second-person')
    expect(keys[2]).toBe('third-person')
  })
})
