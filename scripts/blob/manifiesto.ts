/**
 * Funciones puras del manifiesto de PDFs de revistas en Vercel Blob (PF-062,
 * PF-077). Viven aparte de `upload-revistas.ts` para poder importarlas (y
 * probarlas) sin efectos: aquel archivo ejecuta `main()` al cargarse.
 */
import { isAbsolute, join } from 'node:path';

/** Mapa `"<nombre-de-archivo>.pdf" -> "<url pública https>"`. */
export type ManifiestoBlob = Record<string, string>;

/** Carpeta de origen de los PDF cuando no se pasa argumento. */
export const DIRECTORIO_PDFS_POR_DEFECTO = 'public/revistas/completas';

/**
 * Fusiona las entradas recién subidas con el manifiesto existente.
 *
 * - Conserva todas las entradas existentes que no aparecen en `nuevas`.
 * - Si una clave está en ambos, gana la URL de `nuevas`.
 * - La salida lleva las claves ordenadas, así el diff del manifiesto es
 *   estable sin importar el orden de subida.
 * - No muta ninguno de los dos argumentos.
 *
 * @throws {Error} si alguna URL nueva está vacía o no es `https://`: no se
 * debe pisar una entrada buena con una vacía (`blobUrl` lanzaría al compilar).
 */
export function fusionarManifiesto(
  existente: Readonly<ManifiestoBlob>,
  nuevas: Readonly<ManifiestoBlob>,
): ManifiestoBlob {
  for (const [nombre, url] of Object.entries(nuevas)) {
    if (typeof url !== 'string' || !url.startsWith('https://')) {
      throw new Error(
        `La URL nueva de "${nombre}" no es válida (se esperaba https://): "${String(url)}".`,
      );
    }
  }

  const fusionado: ManifiestoBlob = { ...existente, ...nuevas };
  const resultado: ManifiestoBlob = {};
  for (const nombre of Object.keys(fusionado).sort()) {
    resultado[nombre] = fusionado[nombre];
  }
  return resultado;
}

/**
 * Resuelve la carpeta de origen de los PDF a partir de los argumentos CLI
 * (sin `node` ni el script). Toma el primer argumento posicional; una ruta
 * relativa se resuelve contra `cwd`. Sin argumento, usa
 * `public/revistas/completas` bajo `cwd`.
 *
 * @throws {Error} si recibe una opción desconocida (empieza por `-`) o más
 * de un argumento posicional.
 */
export function resolverDirectorioOrigen(args: readonly string[], cwd: string): string {
  const opciones = args.filter((arg) => arg.startsWith('-'));
  if (opciones.length > 0) {
    throw new Error(`Opción no reconocida: "${opciones[0]}". Uso: upload-revistas.ts [carpeta-de-origen]`);
  }
  if (args.length > 1) {
    throw new Error('Se esperaba como máximo una carpeta de origen. Uso: upload-revistas.ts [carpeta-de-origen]');
  }

  const [carpeta] = args;
  if (carpeta === undefined || carpeta === '') {
    return join(cwd, DIRECTORIO_PDFS_POR_DEFECTO);
  }
  return isAbsolute(carpeta) ? carpeta : join(cwd, carpeta);
}
