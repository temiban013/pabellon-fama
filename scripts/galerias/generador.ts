/**
 * Generador de src/data/galerias/novena-exaltacion-2026.ts (PF-073).
 * Lógica pura + E/S; el punto de entrada es generar-galeria-novena.ts.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import sharp from 'sharp';
import { EXALTACION_2026 } from '../../src/lib/data/exaltacion-2026';
import {
  EVENTO,
  leerManifiesto,
  pathnameFull,
  pathnameThumb,
  PATHNAME_OG,
  urlBlob,
  type Manifiesto,
} from './manifiesto';

export const RUTA_DATOS = 'src/data/galerias/novena-exaltacion-2026.ts';

interface FotoSalida {
  id: string;
  src: string;
  thumb: string;
  width: number;
  height: number;
  alt: string;
  categoria: string;
  pie?: string;
}

interface ImagenSalida {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface Dimensiones {
  width: number;
  height: number;
}

/** Mide una imagen local con sharp (dimensiones reales, no declaradas). */
export async function medirImagen(ruta: string): Promise<Dimensiones> {
  const { width, height } = await sharp(ruta).metadata();
  if (!width || !height) {
    throw new Error(`No se pudieron medir las dimensiones de ${ruta}.`);
  }
  return { width, height };
}

/** Construye el contenido TypeScript del archivo de datos. Función pura. */
export function construirContenido(manifiesto: Manifiesto, flyer: Dimensiones): string {
  const ordenadas = [...manifiesto.seleccion].sort((a, b) => a.orden - b.orden);

  const fotoFlyer: FotoSalida = {
    id: 'invitacion',
    src: EXALTACION_2026.flyer.src,
    thumb: EXALTACION_2026.flyer.src,
    width: flyer.width,
    height: flyer.height,
    alt: EXALTACION_2026.flyer.alt,
    categoria: 'invitacion',
    pie: 'La invitación',
  };

  const fotos: FotoSalida[] = [
    fotoFlyer,
    ...ordenadas.map((f): FotoSalida => ({
      id: f.id,
      src: urlBlob(pathnameFull(f.id)),
      thumb: urlBlob(pathnameThumb(f.id)),
      width: f.full.width,
      height: f.full.height,
      alt: f.alt,
      categoria: f.categoria,
      ...(f.pie ? { pie: f.pie } : {}),
    })),
  ];

  const deLaPortada = ordenadas.find((f) => f.id === manifiesto.destacadas.portada);
  if (!deLaPortada) {
    throw new Error(`La portada "${manifiesto.destacadas.portada}" no está en la selección.`);
  }
  const portada: ImagenSalida = {
    src: urlBlob(pathnameFull(deLaPortada.id)),
    alt: deLaPortada.alt,
    width: deLaPortada.full.width,
    height: deLaPortada.full.height,
  };
  const og: ImagenSalida = {
    src: urlBlob(PATHNAME_OG),
    alt: manifiesto.destacadas.og.alt,
    width: manifiesto.destacadas.og.width,
    height: manifiesto.destacadas.og.height,
  };

  const json = (valor: unknown): string => JSON.stringify(valor, null, 2);
  const indentado = (valor: unknown): string => json(valor).replace(/\n/g, '\n  ');

  return `/**
 * ARCHIVO GENERADO — no editar a mano.
 *
 * Generado por scripts/galerias/generar-galeria-novena.ts a partir de
 * manifest.json (evento: ${manifiesto.evento}, generado: ${manifiesto.generado}).
 * Para regenerarlo: ver el encabezado de ese script.
 * Las imágenes viven en Vercel Blob (scripts/blob/upload-galeria-novena.ts);
 * la primera foto es el flyer local de la invitación.
 */
import type { Galeria } from "./types";

export const galeriaNovenaExaltacion2026: Galeria = {
  id: ${json(EVENTO)},
  titulo: "Galería de la ceremonia",
  credito: ${json(manifiesto.credito)},
  portada: ${indentado(portada)},
  og: ${indentado(og)},
  fotos: ${indentado(fotos)},
};
`;
}

/**
 * Lee y valida MEDIA_DIR/manifest.json y escribe el archivo de datos.
 * `raiz` es la raíz del repositorio (por defecto, el cwd).
 */
export async function generarGaleria(
  directorioMedia: string,
  raiz: string = process.cwd(),
  rutaSalida: string = RUTA_DATOS,
): Promise<{ salida: string; fotos: number }> {
  const manifiesto = leerManifiesto(directorioMedia);
  const flyer = await medirImagen(join(raiz, 'public', EXALTACION_2026.flyer.src));
  const contenido = construirContenido(manifiesto, flyer);
  const salida = join(raiz, rutaSalida);
  mkdirSync(dirname(salida), { recursive: true });
  writeFileSync(salida, contenido, 'utf-8');
  return { salida, fotos: manifiesto.seleccion.length + 1 };
}
