/**
 * Genera `src/data/galerias/novena-exaltacion-2026.ts` desde el manifest.json
 * de la galería (PF-073).
 *
 * Uso (desde la raíz del repo):
 *   pnpm dlx tsx scripts/galerias/generar-galeria-novena.ts
 *   GALERIA_NOVENA_DIR=/ruta/a/2026-novena pnpm dlx tsx scripts/galerias/generar-galeria-novena.ts
 *
 * Directorio de medios (MEDIA_DIR): variable GALERIA_NOVENA_DIR, o
 * /home/nitaino/Development/active/pabellon-media/exaltaciones/2026-novena
 * si existe; de lo contrario falla con un mensaje claro.
 *
 * Valida el manifest (zod) y no sube nada: la subida a Vercel Blob es
 * scripts/blob/upload-galeria-novena.ts.
 */
import { generarGaleria } from './generador';
import { resolverDirectorioMedia } from './manifiesto';

async function main(): Promise<void> {
  const directorio = resolverDirectorioMedia();
  console.log(`Leyendo ${directorio}/manifest.json ...`);
  const { salida, fotos } = await generarGaleria(directorio);
  console.log(`Listo: ${fotos} foto(s) (incluye la invitación) escritas en ${salida}`);
}

main().catch((error: unknown) => {
  const mensaje = error instanceof Error ? error.message : String(error);
  console.error(`Error al generar la galería: ${mensaje}`);
  process.exit(1);
});
