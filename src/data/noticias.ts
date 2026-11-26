/**
 * Noticias del Pabellón de la Fama del Deporte Humacaeño (PF-051)
 *
 * Flujo editorial (sin CMS, igual que visitas.ts):
 * la Junta envía el texto → Mario lo convierte en una entrada aquí → deploy.
 *
 * Convenciones:
 * - `slug`: kebab-case, único (es la URL /noticias/[slug]).
 * - `fecha`: ISO YYYY-MM-DD con semántica America/Puerto_Rico
 *   (usar parseDateLocal de @/lib/date-utils — NUNCA new Date("YYYY-MM-DD")).
 * - `resumen`: máximo 160 caracteres (tarjeta de lista + meta description).
 * - `contenido`: párrafos como texto plano; se renderizan como nodos de
 *   texto en <p> — NUNCA HTML ni dangerouslySetInnerHTML.
 * - `cuerpo` (PF-087): alternativa a `contenido` para textos con estructura
 *   (crónicas firmadas): bloques tipados de src/data/noticia-bloques.ts.
 *   Una noticia trae `contenido` o `cuerpo`, nunca los dos.
 * - `exaltadoSlug`: id VIVO del directorio (ej. "julio-yuyo-maldonado")
 *   para noticias "en-memoria" — debe existir en todosLosExaltados.
 * - Imágenes: viven en /public/images/noticias/, optimizadas a ~1600px
 *   en su lado mayor. Las noticias con galería (`galeriaId`) usan la portada
 *   y la imagen OG de la galería (URLs absolutas de Vercel Blob).
 * - Tratamiento "en-memoria": sobrio — insignia slate neutral, sin acento
 *   dorado ni adornos.
 */

import { parseDateLocal } from "@/lib/date-utils";
import { EXALTACION_2026 } from "@/lib/data/exaltacion-2026";
import { formatearFechaLargaSinComaAST } from "@/lib/exaltacion";
import { getGaleria, type GaleriaId } from "@/data/galerias";
import { textoDeBloques, type BloqueNoticia } from "@/data/noticia-bloques";
import { cuerpoCronicaNovena2026 } from "@/data/cronicas/novena-exaltacion-2026";

export type CategoriaNoticia =
  | "en-memoria"
  | "anuncio"
  | "evento"
  | "exaltacion"
  | "cronica";

export interface Noticia {
  /** URL slug, kebab-case, unique. */
  readonly slug: string;
  readonly titulo: string;
  /** Segunda línea del titular; en `<title>` y en el JSON-LD va unida con «: ». */
  readonly subtitulo?: string;
  /** Firma del texto, tal como firmó su autor. Sin autor, firma el Pabellón. */
  readonly autor?: {
    readonly nombre: string;
    readonly descripcion?: string;
  };
  /** ISO date YYYY-MM-DD (America/Puerto_Rico semantics) */
  readonly fecha: string;
  readonly categoria: CategoriaNoticia;
  /** List-card + meta description (<=160 chars) */
  readonly resumen: string;
  /** Body paragraphs rendered as <p> text nodes. No HTML. */
  readonly contenido?: readonly string[];
  /** Cuerpo por bloques (PF-087); excluye a `contenido`. */
  readonly cuerpo?: readonly BloqueNoticia[];
  /** Slugs de otras noticias para «Sigue leyendo». */
  readonly relacionadas?: readonly string[];
  /** Enlaces internos adicionales de «Sigue leyendo». */
  readonly enlaces?: readonly {
    readonly texto: string;
    readonly href: string;
  }[];
  /** Live directorio id (e.g. "julio-yuyo-maldonado") for en-memoria items */
  readonly exaltadoSlug?: string;
  /** ID de video de YouTube; si está presente se muestra embebido al final */
  readonly youtubeId?: string;
  /** Crédito visible bajo el video de `youtubeId` (p. ej. «Cámara y edición: …»). */
  readonly youtubeCredito?: string;
  /**
   * Videos adicionales de YouTube (PF-073): se muestran en una cuadrícula
   * «Momentos en video» después de la galería. `titulo` es el pie visible y el
   * `title` del iframe; nombres de personas solo con fuente.
   */
  readonly videos?: readonly {
    readonly youtubeId: string;
    readonly titulo: string;
  }[];
  readonly imagen?: {
    /** Ruta bajo public/images/noticias/ o URL absoluta (Vercel Blob). */
    readonly src: string;
    readonly alt: string;
    readonly width: number;
    readonly height: number;
    /** Crédito fotográfico visible bajo la imagen. */
    readonly credito?: string;
  };
  /** Imagen Open Graph (1200×630); si falta, se usa `imagen`. */
  readonly imagenOg?: {
    readonly src: string;
    readonly alt: string;
    readonly width: number;
    readonly height: number;
  };
  /** Clave del registro src/data/galerias: galería de fotos bajo el cuerpo. */
  readonly galeriaId?: GaleriaId;
  readonly actualizaciones?: readonly {
    readonly fecha: string;
    readonly texto: string;
  }[];
}

// Contenido inicial (§9 del spec). Redacción final autorizada por la Junta
// (2026-07-14). RESTRICCIÓN VIGENTE: solo hechos verificados — NO añadir
// edades, causa de muerte, sobrevivientes ni relaciones familiares sin
// confirmación de la Junta.

// PF-072: la ceremonia ya se celebró. Fecha y sede derivadas de EXALTACION_2026
// («domingo 8 de noviembre de 2026»).
const FECHA_EXALTACION = formatearFechaLargaSinComaAST(EXALTACION_2026.inicio);
const LUGAR_EXALTACION = `${EXALTACION_2026.sede.nombre} de ${EXALTACION_2026.sede.municipio}`;

// PF-073: galería de la ceremonia (fotos en Vercel Blob).
const GALERIA_EXALTACION = getGaleria("novena-exaltacion-2026");

/** Foto de una galería por su id; lanza si no existe (falla al compilar). */
export function fotoDeGaleria(galeriaId: GaleriaId, fotoId: string) {
  const foto = getGaleria(galeriaId).fotos.find((f) => f.id === fotoId);
  if (!foto) {
    throw new Error(`La galería "${galeriaId}" no tiene la foto "${fotoId}".`);
  }
  return foto;
}

// PF-087: foto principal de la crónica, tomada de la galería de la ceremonia.
const FOTO_PRINCIPAL_CRONICA = fotoDeGaleria(
  "novena-exaltacion-2026",
  "pxl-20261108-190313536"
);

const ENLACE_REVISTA_NOVENA = {
  texto: "Revista de la Novena Exaltación",
  href: "/revistas/9",
} as const;

export const SLUG_CRONICA_NOVENA = "cronica-novena-exaltacion-2026";

export const noticias: readonly Noticia[] = [
  {
    slug: SLUG_CRONICA_NOVENA,
    titulo: "La Ciudad Gris aplaude a sus Héroes",
    subtitulo: "Crónica de la 9na. Ceremonia de Exaltación del PFDH",
    autor: {
      nombre: "Félix Báez Neris",
      descripcion: "Profesor jubilado de la UPRH",
    },
    fecha: "2026-11-26",
    categoria: "cronica",
    resumen:
      "Crónica de Félix Báez Neris sobre la Novena Ceremonia de Exaltación, celebrada el 8 de noviembre de 2026 en el Centro de Bellas Artes de Humacao.",
    cuerpo: cuerpoCronicaNovena2026,
    imagen: {
      src: FOTO_PRINCIPAL_CRONICA.src,
      alt: FOTO_PRINCIPAL_CRONICA.alt,
      width: FOTO_PRINCIPAL_CRONICA.width,
      height: FOTO_PRINCIPAL_CRONICA.height,
      ...(GALERIA_EXALTACION.credito
        ? { credito: GALERIA_EXALTACION.credito }
        : {}),
    },
    // Recorte 1200×630 de la misma foto, hecho desde el original, sin EXIF.
    imagenOg: {
      src: "/images/noticias/cronica-novena-exaltacion-2026-og.jpg",
      alt: FOTO_PRINCIPAL_CRONICA.alt,
      width: 1200,
      height: 630,
    },
    relacionadas: [EXALTACION_2026.noticiaSlug],
    enlaces: [ENLACE_REVISTA_NOVENA],
  },
  {
    slug: EXALTACION_2026.noticiaSlug,
    titulo: "Novena Exaltación del Pabellón de la Fama",
    fecha: "2026-10-01",
    categoria: "exaltacion",
    resumen: `El Pabellón celebró su ${EXALTACION_2026.titulo} el ${FECHA_EXALTACION} en el ${LUGAR_EXALTACION}.`,
    contenido: [
      `El Pabellón de la Fama del Deporte Humacaeño celebró su ${EXALTACION_2026.titulo} el ${FECHA_EXALTACION} en el ${LUGAR_EXALTACION}.`,
      `La ceremonia llevó por lema «${EXALTACION_2026.lema}».`,
      "Para más información, comuníquese al 787-410-1237 o escriba a informa@pfdh.org.",
    ],
    // PF-073: la imagen principal es la portada de la galería; el flyer 2:3
    // (EXALTACION_2026.flyer) pasó a ser «La invitación», primera foto de la galería.
    imagen: GALERIA_EXALTACION.portada,
    imagenOg: GALERIA_EXALTACION.og,
    galeriaId: "novena-exaltacion-2026",
    // PF-087: la crónica firmada de la ceremonia es una noticia aparte.
    relacionadas: [SLUG_CRONICA_NOVENA],
    enlaces: [ENLACE_REVISTA_NOVENA],
    // PF-073: ceremonia completa (cámara y edición de Reinaldo Álvarez, por encargo
    // de la Junta; video público en @PabellonFDH).
    youtubeId: "wHCHip8EoJI",
    // PF-075: tal como lo dicen los créditos del propio video. No ampliar el nombre.
    youtubeCredito: "Cámara y edición: Reinaldo Álvarez",
    // PF-073: seis clips breves, «No listado» en YouTube (solo se ven desde aquí).
    // Los tres nombres son los que Mario puso en los títulos de YouTube (2026-11-12).
    videos: [
      { youtubeId: "YivSpF5SXmw", titulo: "El escenario" },
      { youtubeId: "AVoZTc1-xLQ", titulo: "Obed Santana Acosta" },
      { youtubeId: "2DtweeQToSo", titulo: "Francisco Betancourt" },
      { youtubeId: "oVjRyW4ZImg", titulo: "Un momento solemne" },
      { youtubeId: "yZFX7DMjLxI", titulo: "Los exaltados con sus trofeos" },
      { youtubeId: "KWyPvNH9HEg", titulo: "Palabras de José Escalera" },
    ],
    actualizaciones: [
      {
        fecha: "2026-11-11",
        texto:
          "La ceremonia se celebró el domingo 8 de noviembre de 2026; se actualizó el texto para reflejarlo.",
      },
      {
        fecha: "2026-11-12",
        texto: "Se añadieron la galería de fotos y los videos de la ceremonia.",
      },
    ],
  },
  {
    slug: "entrevista-pipa-sierra",
    titulo: 'Entrevista a Ángel Luis "Pipá" Sierra Ruffat',
    fecha: "2026-08-30",
    categoria: "anuncio",
    resumen:
      'El Pabellón publica su entrevista a Ángel Luis "Pipá" Sierra Ruffat, exaltado en Béisbol en el año 2006, grabada en nuestro museo.',
    contenido: [
      'El Pabellón de la Fama del Deporte Humacaeño comparte la entrevista a Ángel Luis "Pipá" Sierra Ruffat, exaltado en la disciplina de Béisbol en la Cuarta Exaltación, celebrada en el año 2006.',
      'La conversación estuvo a cargo de Enrique "Quique" Torres, Presidente del Pabellón, y se grabó en el Museo Manuel Rivera Guevara, con la dirección y cámara de Héctor Ruiz.',
      "Pipá jugó sus quince temporadas con los Grises Orientales de Humacao, donde debutó en Doble A en 1968, a los 18 años. Bateó para .324 de por vida, con 378 indiscutibles en 1,166 turnos al bate, 204 carreras anotadas y 194 impulsadas. En 1995 fue exaltado al Recinto de los Inmortales del Béisbol Aficionado de Puerto Rico.",
      "La entrevista ya está disponible en nuestro canal de YouTube y puede verse a continuación.",
    ],
    exaltadoSlug: "angel-pipa-sierra-ruffat",
    youtubeId: "nbBzxkL1aTU",
    imagen: {
      src: "/images/noticias/entrevista-pipa-sierra.jpg",
      alt: 'Miniatura de la entrevista a Ángel Luis "Pipá" Sierra Ruffat en el canal de YouTube del Pabellón',
      width: 1280,
      height: 720,
    },
  },
  {
    slug: "entrevista-josie-marrero",
    titulo: 'Entrevista a José Luis "Josie" Marrero Rodríguez',
    fecha: "2026-08-06",
    categoria: "anuncio",
    resumen:
      'El Pabellón publica su entrevista a José Luis "Josie" Marrero Rodríguez, exaltado en Levantamiento de Pesas en el año 2000, grabada en nuestro museo.',
    contenido: [
      'El Pabellón de la Fama del Deporte Humacaeño comparte la entrevista a José Luis "Josie" Marrero Rodríguez, exaltado en la disciplina de Levantamiento de Pesas en la Primera Exaltación, celebrada en el año 2000.',
      "La conversación estuvo a cargo del Prof. Félix Báez Neris, Vicepresidente e historiador del Pabellón, y se grabó en el Museo Manuel Rivera Guevara, con la dirección técnica de Héctor Ruiz.",
      "Josie, reconocido como entrenador nacional, presidió por más de 25 años el Club de Levantamiento de Pesas de Humacao y participó en el desarrollo y la preparación de más de mil pesistas, entre ellos atletas que llegaron a Juegos Olímpicos.",
      "La entrevista ya está disponible en nuestro canal de YouTube y puede verse a continuación.",
    ],
    exaltadoSlug: "jose-jossie-marrero-rodriguez",
    youtubeId: "UmyJa-N4XEc",
    imagen: {
      src: "/images/noticias/entrevista-josie-marrero.jpg",
      alt: 'Miniatura de la entrevista a José Luis "Josie" Marrero Rodríguez en el canal de YouTube del Pabellón',
      width: 1280,
      height: 720,
    },
  },
  {
    slug: "en-memoria-miguel-papuso-garcia-cruz",
    titulo: 'En memoria de Miguel "Papuso" García Cruz',
    fecha: "2026-07-14",
    categoria: "en-memoria",
    resumen:
      'El Pabellón lamenta el fallecimiento de Miguel "Papuso" García Cruz, atleta de pista y campo exaltado en 2015, ocurrido el 9 de mayo de 2026.',
    contenido: [
      'La Junta de Directores del Pabellón de la Fama del Deporte Humacaeño lamenta profundamente el fallecimiento de Miguel "Papuso" García Cruz, ocurrido el 9 de mayo de 2026.',
      "Criado en la Extensión Roig de Humacao, Papuso se distinguió como atleta de pista y campo. Su trayectoria le mereció la exaltación al Pabellón de la Fama del Deporte Humacaeño en la Octava Exaltación, celebrada en el año 2015.",
      "La Junta de Directores extiende sus más sentidas condolencias a sus familiares y amistades. Su legado permanece vivo en nuestro Museo, donde su historia seguirá inspirando a las nuevas generaciones del deporte humacaeño.",
    ],
    exaltadoSlug: "miguel-papuso-garcia-cruz",
  },
  {
    slug: "en-memoria-julio-yuyo-luzunaris-maldonado",
    titulo: 'En memoria de Julio "Yuyo" Luzunaris Maldonado',
    fecha: "2026-07-14",
    categoria: "en-memoria",
    resumen:
      'El Pabellón lamenta el fallecimiento de Julio "Yuyo" Luzunaris Maldonado, exaltado en Atletismo en el año 2000, ocurrido en California el 13 de julio de 2026.',
    contenido: [
      'La Junta de Directores del Pabellón de la Fama del Deporte Humacaeño lamenta profundamente el fallecimiento de Julio "Yuyo" Luzunaris Maldonado, ocurrido en California el 13 de julio de 2026.',
      "Exaltado en la disciplina de Atletismo en la Primera Exaltación del Pabellón, celebrada en el año 2000, Yuyo formó parte de la historia pionera del deporte humacaeño como defensa del Jumacao Fútbol Club de 1958, equipo campeón del primer Torneo Local de Fútbol Juvenil y subcampeón nacional, según recoge la Revista Número 5 del Pabellón.",
      "Sus restos serán trasladados a Humacao. Los detalles de los actos fúnebres se anunciarán tan pronto estén disponibles.",
      "La Junta de Directores extiende sus más sentidas condolencias a sus familiares y amistades.",
    ],
    exaltadoSlug: "julio-yuyo-maldonado",
  },
];

// El parámetro `source` (default: el arreglo real) existe solo para poder
// probar los helpers con fixtures en tests unitarios.

/** Todas las noticias, ordenadas descendente por fecha (más reciente primero). */
export function getNoticias(
  source: readonly Noticia[] = noticias
): readonly Noticia[] {
  return [...source].sort(
    (a, b) =>
      parseDateLocal(b.fecha).getTime() - parseDateLocal(a.fecha).getTime()
  );
}

/** Busca una noticia por su slug; undefined si no existe. */
export function getNoticiaBySlug(
  slug: string,
  source: readonly Noticia[] = noticias
): Noticia | undefined {
  return source.find((noticia) => noticia.slug === slug);
}

/** Las n noticias más recientes (para el bloque de portada). */
export function getUltimasNoticias(
  n: number,
  source: readonly Noticia[] = noticias
): readonly Noticia[] {
  return getNoticias(source).slice(0, n);
}

/**
 * Texto de la noticia, un elemento por párrafo: `contenido` tal cual, o el
 * texto de los bloques de `cuerpo`. Es lo que va a `articleBody`.
 */
export function parrafosDeNoticia(noticia: Noticia): readonly string[] {
  if (noticia.cuerpo) return textoDeBloques(noticia.cuerpo);
  return noticia.contenido ?? [];
}

/** Titular completo: título y subtítulo unidos con «: ». */
export function titularCompleto(noticia: Noticia): string {
  return noticia.subtitulo
    ? `${noticia.titulo}: ${noticia.subtitulo}`
    : noticia.titulo;
}

/** Noticias de «Sigue leyendo», en el orden declarado; omite slugs inexistentes. */
export function getRelacionadas(
  noticia: Noticia,
  source: readonly Noticia[] = noticias
): readonly Noticia[] {
  return (noticia.relacionadas ?? [])
    .map((slug) => getNoticiaBySlug(slug, source))
    .filter((n): n is Noticia => n !== undefined);
}
