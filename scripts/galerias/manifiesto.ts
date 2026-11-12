/**
 * Lógica compartida de la galería de la Novena Exaltación (PF-073):
 * ubicación de MEDIA_DIR, validación del manifest.json y URLs deterministas
 * de Vercel Blob. La usan el generador (generar-galeria-novena.ts), el
 * script de subida (scripts/blob/upload-galeria-novena.ts) y las pruebas.
 *
 * Sin dependencias de Next ni alias `@/`, para poder correr con `tsx`.
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { z } from 'zod';

export const EVENTO = 'novena-exaltacion-2026';

/** Host público del store de Vercel Blob (el mismo de revistas/blob-manifest.json). */
export const BLOB_BASE_URL = 'https://licijzlydvcugjx5.public.blob.vercel-storage.com';

export const PREFIJO_BLOB = `galerias/${EVENTO}`;

export const DIRECTORIO_POR_DEFECTO =
  '/home/nitaino/Development/active/pabellon-media/exaltaciones/2026-novena';

export const CATEGORIAS = [
  'llegada',
  'apertura',
  'reconocimiento',
  'discurso',
  'familia',
  'junta',
  'grupal',
  'publico',
  'detalles',
] as const;

/** Resuelve MEDIA_DIR: env GALERIA_NOVENA_DIR -> ruta por defecto -> error. */
export function resolverDirectorioMedia(
  env: Record<string, string | undefined> = process.env,
  existe: (ruta: string) => boolean = existsSync,
): string {
  const deEntorno = env.GALERIA_NOVENA_DIR;
  if (deEntorno) {
    if (!existe(join(deEntorno, 'manifest.json'))) {
      throw new Error(
        `GALERIA_NOVENA_DIR apunta a "${deEntorno}", pero ahí no existe manifest.json.`,
      );
    }
    return deEntorno;
  }
  if (existe(DIRECTORIO_POR_DEFECTO)) {
    return DIRECTORIO_POR_DEFECTO;
  }
  throw new Error(
    'No se encontró el directorio de medios de la galería. Define la variable ' +
      'GALERIA_NOVENA_DIR con la ruta que contiene manifest.json, o crea ' +
      `${DIRECTORIO_POR_DEFECTO}.`,
  );
}

const entero = z.number().int().positive();

const derivado = z.object({
  archivo: z.string().min(1),
  width: entero,
  height: entero,
  bytes: entero,
});

const idFoto = z.string().regex(/^[a-z0-9][a-z0-9-]*$/, 'id inválido (use minúsculas, dígitos y guiones)');

const seleccionSchema = z.object({
  id: idFoto,
  archivo_original: z.string().min(1),
  orden: entero,
  categoria: z.enum(CATEGORIAS),
  alt: z.string().trim().min(1, 'alt vacío'),
  pie: z.string().trim().min(1).nullable(),
  edicion: z.string().nullable().optional(),
  full: derivado,
  thumb: derivado,
});

const ogSchema = derivado.extend({
  de: idFoto,
  alt: z.string().trim().min(1, 'alt de og vacío'),
});

export const manifiestoSchema = z
  .object({
    evento: z.literal(EVENTO),
    generado: z.string().min(1),
    credito: z.string().trim().min(1).nullable(),
    seleccion: z.array(seleccionSchema).min(1),
    destacadas: z.object({
      portada: idFoto,
      og: ogSchema,
    }),
  })
  .superRefine((m, ctx) => {
    const ids = new Set<string>();
    const ordenes = new Set<number>();
    m.seleccion.forEach((foto, i) => {
      if (ids.has(foto.id)) {
        ctx.addIssue({ code: 'custom', message: `id repetido: ${foto.id}`, path: ['seleccion', i, 'id'] });
      }
      ids.add(foto.id);
      if (ordenes.has(foto.orden)) {
        ctx.addIssue({ code: 'custom', message: `orden repetido: ${foto.orden}`, path: ['seleccion', i, 'orden'] });
      }
      ordenes.add(foto.orden);
      if (foto.full.archivo !== `derivados/full/${foto.id}.webp`) {
        ctx.addIssue({ code: 'custom', message: `full.archivo inesperado: ${foto.full.archivo}`, path: ['seleccion', i, 'full', 'archivo'] });
      }
      if (foto.thumb.archivo !== `derivados/thumb/${foto.id}.webp`) {
        ctx.addIssue({ code: 'custom', message: `thumb.archivo inesperado: ${foto.thumb.archivo}`, path: ['seleccion', i, 'thumb', 'archivo'] });
      }
    });
    if (!ids.has(m.destacadas.portada)) {
      ctx.addIssue({ code: 'custom', message: `portada "${m.destacadas.portada}" no está en seleccion`, path: ['destacadas', 'portada'] });
    }
    if (!ids.has(m.destacadas.og.de)) {
      ctx.addIssue({ code: 'custom', message: `og.de "${m.destacadas.og.de}" no está en seleccion`, path: ['destacadas', 'og', 'de'] });
    }
    const og = m.destacadas.og;
    if (og.archivo !== 'derivados/og-1200x630.jpg' || og.width !== 1200 || og.height !== 630) {
      ctx.addIssue({ code: 'custom', message: 'og debe ser derivados/og-1200x630.jpg de 1200x630', path: ['destacadas', 'og'] });
    }
  });

export type Manifiesto = z.infer<typeof manifiestoSchema>;
export type FotoSeleccionada = Manifiesto['seleccion'][number];

/** Lee y valida MEDIA_DIR/manifest.json; lanza con la lista de problemas. */
export function leerManifiesto(directorio: string): Manifiesto {
  const ruta = join(directorio, 'manifest.json');
  let crudo: unknown;
  try {
    crudo = JSON.parse(readFileSync(ruta, 'utf-8'));
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : String(error);
    throw new Error(`No se pudo leer ${ruta}: ${mensaje}`);
  }
  const resultado = manifiestoSchema.safeParse(crudo);
  if (!resultado.success) {
    const problemas = resultado.error.issues
      .map((p) => `  - ${p.path.join('.') || '(raíz)'}: ${p.message}`)
      .join('\n');
    throw new Error(`manifest.json inválido (${ruta}):\n${problemas}`);
  }
  return resultado.data;
}

// --- URLs deterministas de Blob (subida sin sufijo aleatorio) ---

export const pathnameFull = (id: string): string => `${PREFIJO_BLOB}/full/${id}.webp`;
export const pathnameThumb = (id: string): string => `${PREFIJO_BLOB}/thumb/${id}.webp`;
export const PATHNAME_OG = `${PREFIJO_BLOB}/og-1200x630.jpg`;

export const urlBlob = (pathname: string): string => `${BLOB_BASE_URL}/${pathname}`;
