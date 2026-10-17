/**
 * Fuente única de verdad de la Novena Exaltación (2026).
 * Fuente: flyer oficial de invitación, enviado por Quique a Mario el 2026-10-12
 * (public/images/noticias/novena-exaltacion-2026.jpg).
 *
 * NO inventar datos que el flyer no trae: hora de fin, costo, reservaciones,
 * dirección postal ni nombres de la clase exaltada.
 */

export interface SedeEvento {
  readonly nombre: string;
  readonly municipio: string;
}

export interface ImagenEvento {
  readonly src: string;
  readonly alt: string;
  readonly width: number;
  readonly height: number;
}

export interface ExaltacionEvento {
  readonly numero: number;
  readonly ordinal: string;
  readonly titulo: string;
  readonly lema: string;
  readonly inicio: Date;
  /** null hasta que la Junta indique hora de cierre. NO inventar duración. */
  readonly fin: Date | null;
  readonly sede: SedeEvento;
  readonly flyer: ImagenEvento;
  readonly noticiaSlug: string;
}

export const EXALTACION_2026: ExaltacionEvento = {
  numero: 9,
  ordinal: "Novena",
  titulo: "Novena Exaltación",
  lema: "Honrando nuestros atletas y propulsores",
  inicio: new Date("2026-11-08T13:00:00-04:00"),
  fin: null,
  sede: {
    nombre: "Centro de Bellas Artes Águedo Mojica Marrero",
    municipio: "Humacao",
  },
  flyer: {
    src: "/images/noticias/novena-exaltacion-2026.jpg",
    alt: "Invitación oficial a la Novena Exaltación del Pabellón de la Fama del Deporte Humacaeño: domingo 8 de noviembre de 2026, 1:00 p.m., Centro de Bellas Artes Águedo Mojica Marrero.",
    width: 1024,
    height: 1536,
  },
  noticiaSlug: "novena-exaltacion-2026",
};
