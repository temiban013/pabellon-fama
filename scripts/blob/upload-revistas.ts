/**
 * Sube los PDFs de una carpeta a Vercel Blob (PF-062, PF-077).
 *
 * Uso (desde la raíz del repo):
 *   node --env-file=.env.local <vite-node.mjs> scripts/blob/upload-revistas.ts [carpeta-de-origen]
 *
 * donde `<vite-node.mjs>` es el `vite-node.mjs` de `node_modules/.pnpm/vite-node@*`
 * (las reglas del repo piden vite-node, no `npx tsx`).
 *
 * Sin argumento lee `public/revistas/completas/`. Con argumento (ruta absoluta
 * o relativa al directorio actual) sube solo los `.pdf` de esa carpeta, p. ej.
 * `.media-staging/revistas` para subir únicamente la revista 9.
 *
 * Requiere `BLOB_READ_WRITE_TOKEN` en el entorno (definido en `.env.local`,
 * nunca en este archivo). El script es idempotente: si el blob ya existe con
 * el mismo tamaño en bytes, se omite la subida y se reutiliza su URL.
 *
 * Al terminar FUSIONA los PDF procesados con
 * `src/data/revistas/blob-manifest.json` (mapa
 * `"<nombre-de-archivo>.pdf" -> "<url pública>"`): las entradas que no están
 * en la carpeta de origen se conservan. Luego muestra una tabla resumen.
 */
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  head,
  put,
  BlobNotFoundError,
  type HeadBlobResult,
  type PutBlobResult,
} from '@vercel/blob';
import { fusionarManifiesto, resolverDirectorioOrigen, type ManifiestoBlob } from './manifiesto';

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

/** Lee el manifiesto actual; si el archivo no existe, devuelve uno vacío. */
function leerManifiestoExistente(): ManifiestoBlob {
  if (!existsSync(RUTA_MANIFIESTO)) {
    return {};
  }
  const datos: unknown = JSON.parse(readFileSync(RUTA_MANIFIESTO, 'utf-8'));
  if (typeof datos !== 'object' || datos === null || Array.isArray(datos)) {
    throw new Error(`${RUTA_MANIFIESTO} no contiene un objeto JSON.`);
  }
  return datos as ManifiestoBlob;
}

async function main(): Promise<void> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error(
      'Falta la variable de entorno BLOB_READ_WRITE_TOKEN. Define el token ' +
        'del store de Vercel Blob en el archivo de entorno local y pásalo con ' +
        '`node --env-file=<archivo>` (ver el encabezado de este script).',
    );
    process.exit(1);
  }

  const directorioPdfs = resolverDirectorioOrigen(process.argv.slice(2), process.cwd());

  const nombresArchivos = readdirSync(directorioPdfs)
    .filter((nombre) => nombre.endsWith('.pdf'))
    .sort();

  console.log(`Subiendo ${nombresArchivos.length} PDF(s) desde ${directorioPdfs}...\n`);

  const resultados: ResultadoSubida[] = [];

  for (const nombre of nombresArchivos) {
    const ruta = join(directorioPdfs, nombre);
    try {
      resultados.push(await subirOReutilizar(nombre, ruta));
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : String(error);
      console.error(`\nError al subir "${nombre}" a Vercel Blob: ${mensaje}`);
      process.exit(1);
    }
  }

  const subidas: ManifiestoBlob = {};
  for (const resultado of resultados) {
    subidas[resultado.nombre] = resultado.url;
  }
  const manifiesto = fusionarManifiesto(leerManifiestoExistente(), subidas);

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
