/**
 * Registro de galerías de fotos de eventos (PF-073).
 * `Noticia.galeriaId` es una clave de este registro; la página de noticia
 * busca la galería aquí, sin referencias al slug.
 */
import type { Galeria } from "./types";
import { galeriaNovenaExaltacion2026 } from "./novena-exaltacion-2026";

export const galerias = {
  "novena-exaltacion-2026": galeriaNovenaExaltacion2026,
} as const satisfies Record<string, Galeria>;

export type GaleriaId = keyof typeof galerias;

export function getGaleria(id: GaleriaId): Galeria {
  return galerias[id];
}
