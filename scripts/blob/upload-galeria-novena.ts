/**
 * Sube la galería de la Novena Exaltación (full + thumb + og) a Vercel Blob (PF-073).
 *
 * Uso:
 *   pnpm dlx tsx --env-file=.env.local scripts/blob/upload-galeria-novena.ts
 *
 * Requiere `BLOB_READ_WRITE_TOKEN` en el entorno (definido en `.env.local`,
 * nunca en este archivo). Lee MEDIA_DIR/manifest.json (variable
 * GALERIA_NOVENA_DIR, o la ruta por defecto en pabellon-media). Es idempotente:
 * si el blob ya existe con el mismo tamaño en bytes, se omite la subida.
 * Los pathnames no llevan sufijo aleatorio, así que las URLs son
 * deterministas; el script falla si Blob devuelve una URL distinta.
 *
 * Al terminar escribe `src/data/galerias/novena-exaltacion-2026.blob-manifest.json`
 * con el mapa `pathname -> url pública` y muestra una tabla resumen.
 */
import { mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import {
  head,
  put,
  BlobNotFoundError,
  type HeadBlobResult,
  type PutBlobResult,
} from '@vercel/blob';
import {
  leerManifiesto,
  pathnameFull,
  pathnameThumb,
  PATHNAME_OG,
  resolverDirectorioMedia,
  urlBlob,
} from '../galerias/manifiesto';

const RUTA_MANIFIESTO = join(
  process.cwd(),
  'src/data/galerias/novena-exaltacion-2026.blob-manifest.json',
);

type AccionRealizada = 'subido' | 'omitido';

interface Elemento {
  /** Ruta local del archivo. */
  ruta: string;
  pathname: string;
  contentType: string;
  /** Tamaño declarado en el manifest.json. */
  bytesDeclarados: number;
}

interface ResultadoSubida {
  pathname: string;
  bytes: number;
  accion: AccionRealizada;
  url: string;
}

/** Lanza si la URL devuelta por Blob no es la determinista esperada. */
function verificarUrl(pathname: string, obtenida: string): void {
  const esperada = urlBlob(pathname);
  if (obtenida !== esperada) {
    throw new Error(
      `URL inesperada para "${pathname}":\n  esperada: ${esperada}\n  obtenida: ${obtenida}`,
    );
  }
}

/**
 * Sube (o reutiliza, si ya existe con el mismo tamaño) un archivo y devuelve
 * el resultado para el reporte final.
 */
async function subirOReutilizar(elemento: Elemento): Promise<ResultadoSubida> {
  const { ruta, pathname, contentType } = elemento;
  const bytes = statSync(ruta).size;

  if (bytes !== elemento.bytesDeclarados) {
    throw new Error(
      `"${ruta}" pesa ${bytes} bytes, pero manifest.json declara ${elemento.bytesDeclarados}.`,
    );
  }

  let existente: HeadBlobResult | undefined;
  try {
    existente = await head(pathname);
  } catch (error) {
    if (!(error instanceof BlobNotFoundError)) {
      throw error;
    }
  }

  if (existente && existente.size === bytes) {
    verificarUrl(pathname, existente.url);
    console.log(`  · ${pathname}: ya existe (${bytes} bytes), se omite`);
    return { pathname, bytes, accion: 'omitido', url: existente.url };
  }

  const resultado: PutBlobResult = await put(pathname, readFileSync(ruta), {
    access: 'public',
    contentType,
    addRandomSuffix: false,
    allowOverwrite: true,
  });
  verificarUrl(pathname, resultado.url);

  console.log(`  · ${pathname}: subido (${bytes} bytes)`);
  return { pathname, bytes, accion: 'subido', url: resultado.url };
}

async function main(): Promise<void> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error(
      'Falta la variable de entorno BLOB_READ_WRITE_TOKEN. Define el token ' +
        'del store de Vercel Blob en el archivo de entorno local antes de ejecutar este script ' +
        '(pnpm dlx tsx --env-file=.env.local scripts/blob/upload-galeria-novena.ts).',
    );
    process.exit(1);
  }

  const directorio = resolverDirectorioMedia();
  const manifiesto = leerManifiesto(directorio);

  const elementos: Elemento[] = [];
  for (const foto of [...manifiesto.seleccion].sort((a, b) => a.orden - b.orden)) {
    elementos.push({
      ruta: join(directorio, foto.full.archivo),
      pathname: pathnameFull(foto.id),
      contentType: 'image/webp',
      bytesDeclarados: foto.full.bytes,
    });
    elementos.push({
      ruta: join(directorio, foto.thumb.archivo),
      pathname: pathnameThumb(foto.id),
      contentType: 'image/webp',
      bytesDeclarados: foto.thumb.bytes,
    });
  }
  const og = manifiesto.destacadas.og;
  elementos.push({
    ruta: join(directorio, og.archivo),
    pathname: PATHNAME_OG,
    contentType: 'image/jpeg',
    bytesDeclarados: og.bytes,
  });

  console.log(`Subiendo ${elementos.length} archivo(s) desde ${directorio}...\n`);

  const resultados: ResultadoSubida[] = [];
  for (const elemento of elementos) {
    try {
      resultados.push(await subirOReutilizar(elemento));
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : String(error);
      console.error(`\nError al subir "${elemento.pathname}" a Vercel Blob: ${mensaje}`);
      process.exit(1);
    }
  }

  const mapa: Record<string, string> = {};
  for (const r of [...resultados].sort((a, b) => a.pathname.localeCompare(b.pathname))) {
    mapa[r.pathname] = r.url;
  }

  mkdirSync(dirname(RUTA_MANIFIESTO), { recursive: true });
  writeFileSync(RUTA_MANIFIESTO, `${JSON.stringify(mapa, null, 2)}\n`, 'utf-8');
  console.log(`\nManifiesto escrito en ${RUTA_MANIFIESTO}`);

  console.log('\nResumen:');
  console.log('pathname'.padEnd(70) + 'bytes'.padEnd(10) + 'acción'.padEnd(10) + 'url');
  for (const r of resultados) {
    console.log(
      r.pathname.padEnd(70) + String(r.bytes).padEnd(10) + r.accion.padEnd(10) + r.url,
    );
  }
  const subidos = resultados.filter((r) => r.accion === 'subido').length;
  console.log(`\n${subidos} subido(s), ${resultados.length - subidos} omitido(s).`);
}

main().catch((error: unknown) => {
  const mensaje = error instanceof Error ? error.message : String(error);
  console.error(`Error inesperado al subir la galería a Vercel Blob: ${mensaje}`);
  process.exit(1);
});
