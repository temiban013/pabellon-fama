/**
 * Tipos comunes de las galerías de fotos de eventos/noticias (PF-073).
 *
 * Las galerías de eventos son datos GENERADOS (ver
 * scripts/galerias/generar-galeria-novena.ts); la galería histórica de
 * revistas (FotoHistorica) y el tour del museo (TourPhoto) mantienen sus
 * propios tipos.
 */

export const CATEGORIAS_FOTO_EVENTO = [
  "invitacion",
  "llegada",
  "apertura",
  "reconocimiento",
  "discurso",
  "familia",
  "junta",
  "grupal",
  "publico",
  "detalles",
] as const;

export type CategoriaFotoEvento = (typeof CATEGORIAS_FOTO_EVENTO)[number];

export interface FotoGaleria {
  readonly id: string;
  /** Imagen a tamaño completo (URL absoluta de Vercel Blob, o ruta local). */
  readonly src: string;
  /** Miniatura (URL absoluta de Vercel Blob, o ruta local). */
  readonly thumb: string;
  readonly width: number;
  readonly height: number;
  /** Texto alternativo en español, sin nombres de personas. */
  readonly alt: string;
  readonly categoria: CategoriaFotoEvento;
  /** Pie de foto opcional que se muestra en el visor. */
  readonly pie?: string;
}

export interface ImagenGaleria {
  readonly src: string;
  readonly alt: string;
  readonly width: number;
  readonly height: number;
}

export interface Galeria {
  /** Clave del registro (src/data/galerias/index.ts). */
  readonly id: string;
  readonly titulo: string;
  readonly fotos: readonly FotoGaleria[];
  /** Imagen principal de la noticia (una foto de la selección). */
  readonly portada: ImagenGaleria;
  /** Imagen para Open Graph (1200×630). */
  readonly og: ImagenGaleria;
  /** Crédito fotográfico; null si no se ha confirmado. */
  readonly credito: string | null;
}
