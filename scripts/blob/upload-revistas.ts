/**
 * Sube los PDFs de `public/revistas/completas/` a Vercel Blob (PF-062).
 *
 * Uso:
 *   pnpm dlx tsx --env-file=.env.local scripts/blob/upload-revistas.ts
 *
 * Requiere `BLOB_READ_WRITE_TOKEN` en el entorno (definido en `.env.local`,
 * nunca en este archivo). El script es idempotente: si el blob ya existe con
 * el mismo tamaño en bytes, se omite la subida y se reutiliza su URL.
 *
 * Al terminar escribe `src/data/revistas/blob-manifest.json` con el mapa
 * `"<nombre-de-archivo>.pdf" -> "<url pública>"` y muestra una tabla resumen
 * por consola.
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  head,
  put,
  BlobNotFoundError,
  type HeadBlobResult,
  type PutBlobResult,
} from '@vercel/blob';

const DIRECTORIO_PDFS = join(process.cwd(), 'public/revistas/completas');
const RUTA_MANIFIESTO = join(process.cwd(), 'src/data/revistas/blob-manifest.json');

type AccionRealizada = 'subido' | 'omitido';

interface ResultadoSubida {
  nombre: string;
  bytes: number;
  accion: AccionRealizada;
  url: string;
}

/**
 * Sube (o reutiliza, si ya existe con el mismo tamaño) el PDF `nombre`
 * ubicado en `ruta`, y devuelve el resultado para el reporte final.
 */
async function subirOReutilizar(nombre: string, ruta: string): Promise<ResultadoSubida> {
  const pathnameBlob = `revistas/${nombre}`;
  const bytes = statSync(ruta).size;

  let existente: HeadBlobResult | undefined;
  try {
    existente = await head(pathnameBlob);
  } catch (error) {
    if (!(error instanceof BlobNotFoundError)) {
      throw error;
    }
  }

  if (existente && existente.size === bytes) {
    console.log(`  · ${nombre}: ya existe (${bytes} bytes), se omite`);
    return { nombre, bytes, accion: 'omitido', url: existente.url };
  }

  const resultado: PutBlobResult = await put(pathnameBlob, readFileSync(ruta), {
    access: 'public',
    contentType: 'application/pdf',
    addRandomSuffix: false,
    allowOverwrite: true,
  });

  console.log(`  · ${nombre}: subido (${bytes} bytes)`);
  return { nombre, bytes, accion: 'subido', url: resultado.url };
}

async function main(): Promise<void> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error(
      'Falta la variable de entorno BLOB_READ_WRITE_TOKEN. Define el token ' +
        'del store de Vercel Blob en .env.local antes de ejecutar este script ' +
        '(pnpm dlx tsx --env-file=.env.local scripts/blob/upload-revistas.ts).',
    );
    process.exit(1);
  }

  const nombresArchivos = readdirSync(DIRECTORIO_PDFS)
    .filter((nombre) => nombre.endsWith('.pdf'))
    .sort();

  console.log(`Subiendo ${nombresArchivos.length} PDF(s) desde ${DIRECTORIO_PDFS}...\n`);

  const resultados: ResultadoSubida[] = [];

  for (const nombre of nombresArchivos) {
    const ruta = join(DIRECTORIO_PDFS, nombre);
    try {
      resultados.push(await subirOReutilizar(nombre, ruta));
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : String(error);
      console.error(`\nError al subir "${nombre}" a Vercel Blob: ${mensaje}`);
      process.exit(1);
    }
  }

  const manifiesto: Record<string, string> = {};
  for (const resultado of resultados) {
    manifiesto[resultado.nombre] = resultado.url;
  }

  writeFileSync(RUTA_MANIFIESTO, `${JSON.stringify(manifiesto, null, 2)}\n`, 'utf-8');

  console.log(`\nManifiesto escrito en ${RUTA_MANIFIESTO}:`);
  console.log(JSON.stringify(manifiesto, null, 2));

  console.log('\nResumen:');
  console.log(
    'nombre'.padEnd(30) + 'bytes'.padEnd(12) + 'acción'.padEnd(10) + 'url',
  );
  for (const r of resultados) {
    console.log(
      r.nombre.padEnd(30) + String(r.bytes).padEnd(12) + r.accion.padEnd(10) + r.url,
    );
  }
}

main().catch((error: unknown) => {
  const mensaje = error instanceof Error ? error.message : String(error);
  console.error(`Error inesperado al subir las revistas a Vercel Blob: ${mensaje}`);
  process.exit(1);
});
