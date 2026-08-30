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
 * - `exaltadoSlug`: id VIVO del directorio (ej. "julio-yuyo-maldonado")
 *   para noticias "en-memoria" — debe existir en todosLosExaltados.
 * - Imágenes: viven en /public/images/noticias/, optimizadas a ~1600px
 *   en su lado mayor.
 * - Tratamiento "en-memoria": sobrio — insignia slate neutral, sin acento
 *   dorado ni adornos.
 */

import { parseDateLocal } from "@/lib/date-utils";

export type CategoriaNoticia =
  | "en-memoria"
  | "anuncio"
  | "evento"
  | "exaltacion";

export interface Noticia {
  /** URL slug, kebab-case, unique. */
  readonly slug: string;
  readonly titulo: string;
  /** ISO date YYYY-MM-DD (America/Puerto_Rico semantics) */
  readonly fecha: string;
  readonly categoria: CategoriaNoticia;
  /** List-card + meta description (<=160 chars) */
  readonly resumen: string;
  /** Body paragraphs rendered as <p> text nodes. No HTML. */
  readonly contenido: readonly string[];
  /** Live directorio id (e.g. "julio-yuyo-maldonado") for en-memoria items */
  readonly exaltadoSlug?: string;
  /** ID de video de YouTube; si está presente se muestra embebido al final */
  readonly youtubeId?: string;
  readonly imagen?: {
    readonly src: string; // under public/images/noticias/
    readonly alt: string;
    readonly width: number;
    readonly height: number;
  };
  readonly actualizaciones?: readonly {
    readonly fecha: string;
    readonly texto: string;
  }[];
}

// Contenido inicial (§9 del spec). Redacción final autorizada por la Junta
// (2026-07-14). RESTRICCIÓN VIGENTE: solo hechos verificados — NO añadir
// edades, causa de muerte, sobrevivientes ni relaciones familiares sin
// confirmación de la Junta.
export const noticias: readonly Noticia[] = [
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
