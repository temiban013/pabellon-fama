/**
 * Slug generation utilities for SEO-friendly URLs
 * Sprint 10 - SEO & Navigation Unification
 */

/**
 * Generates SEO-friendly slugs from exaltado names
 *
 * Examples:
 *   "Néstor Morales Santiago" → "nestor-morales-santiago"
 *   "José (Toñín) Casillas" → "jose-tonin-casillas"
 *   "Equipo Humacao (1951)" → "equipo-humacao-1951"
 *
 * @param nombre - First name(s)
 * @param apellidos - Last name(s)
 * @returns URL-safe slug
 */
export function generateExaltadoSlug(
  nombre: string,
  apellidos: string
): string {
  const full = `${nombre} ${apellidos}`
    .toLowerCase()
    .normalize('NFD') // Decompose accented characters
    .replace(/[\u0300-\u036f]/g, '') // Remove accent marks
    .replace(/[()]/g, '') // Remove parentheses
    .replace(/["']/g, '') // Remove quotes
    .replace(/[^a-z0-9\s-]/g, '') // Remove other special chars
    .replace(/\s+/g, '-') // Spaces to hyphens
    .replace(/-+/g, '-') // Dedupe hyphens
    .replace(/^-+|-+$/g, '') // Trim hyphens
    .trim();

  return full || 'exaltado';
}

/**
 * Validates if a slug is already in semantic format (name-based)
 * vs old format (exaltado-revXX-XXX)
 */
export function isSemanticSlug(id: string): boolean {
  return !id.startsWith('exaltado-rev');
}

/**
 * Batch generate slugs for multiple exaltados
 */
export function generateSlugs(
  exaltados: Array<{ nombre: string; apellidos: string }>
): Map<string, string> {
  const slugs = new Map<string, string>();
  const duplicates = new Map<string, number>();

  for (const exaltado of exaltados) {
    const slug = generateExaltadoSlug(exaltado.nombre, exaltado.apellidos);

    // Handle potential duplicates
    if (slugs.has(slug)) {
      const count = (duplicates.get(slug) || 1) + 1;
      duplicates.set(slug, count);
      slugs.set(`${slug}-${count}`, slug);
    } else {
      slugs.set(slug, slug);
    }
  }

  return slugs;
}
