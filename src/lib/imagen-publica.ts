/**
 * Lectura de dimensiones de imágenes bajo `public/`, para declarar el ancho y
 * alto reales en los metadatos (Open Graph, JSON-LD).
 */
import { join } from "node:path";
import sharp from "sharp";

export interface DimensionesImagen {
  width: number;
  height: number;
}

/**
 * Devuelve el ancho y alto reales de una imagen pública (ruta que empieza por
 * `/`, relativa a `public/`). Devuelve `undefined` si no se puede leer.
 */
export async function dimensionesImagenPublica(
  ruta: string,
): Promise<DimensionesImagen | undefined> {
  try {
    const { width, height } = await sharp(join(process.cwd(), "public", ruta)).metadata();
    return width && height ? { width, height } : undefined;
  } catch {
    return undefined;
  }
}
