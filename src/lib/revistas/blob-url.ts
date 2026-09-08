/**
 * Resuelve URLs absolutas de PDFs de revistas alojados en Vercel Blob (PF-062).
 *
 * La fuente de verdad es `blob-manifest.json`, generado por
 * `scripts/blob/upload-revistas.ts`. Mientras ese manifiesto no esté
 * poblado, cualquier llamada a `blobUrl` lanza un error.
 */
import manifest from '@/data/revistas/blob-manifest.json';

/** Nombre de archivo de un PDF de revista declarado en el manifiesto. */
export type BlobPdfName = keyof typeof manifest;

/** Sufijo de host que usan todas las URLs públicas de un store de Vercel Blob. */
export const BLOB_PUBLIC_HOST_SUFFIX = '.public.blob.vercel-storage.com';

/**
 * Devuelve la URL absoluta del PDF `nombre` en Vercel Blob.
 *
 * @throws {Error} si `nombre` no existe en el manifiesto, o si su valor
 * todavía está vacío o no es una URL `https://` (manifiesto sin poblar).
 */
export function blobUrl(nombre: BlobPdfName): string {
  const url: string | undefined = manifest[nombre];

  if (url === undefined) {
    throw new Error(`No existe la clave "${nombre}" en blob-manifest.json.`);
  }

  if (url === '' || !url.startsWith('https://')) {
    throw new Error(
      `El manifiesto de Vercel Blob no tiene una URL válida para "${nombre}". ` +
        'Ejecuta scripts/blob/upload-revistas.ts para poblarlo.',
    );
  }

  return url;
}
