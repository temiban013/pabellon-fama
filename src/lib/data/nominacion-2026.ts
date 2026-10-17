/**
 * Datos oficiales de la 9na Exaltación 2026.
 * Fuente: Comunicado de prensa oficial de la Junta de Directores PFDH
 * (public/documentos/comunicado-prensa-9na-exaltacion.pdf).
 *
 * La fecha, hora y sede de la ceremonia (`ceremonia`) se DERIVAN de
 * `EXALTACION_2026` (src/lib/data/exaltacion-2026.ts). La sede quedó confirmada
 * por el flyer oficial (2026-10-12); no duplicar esos datos aquí.
 *
 * EDITAR ESTE ARCHIVO únicamente cuando:
 *  - Cambien fechas oficiales del periodo de nominación
 *    (la fecha/sede de la ceremonia se editan en exaltacion-2026.ts)
 *  - Se actualicen teléfonos de contacto o puntos de distribución
 *  - Se proceda a la 10ma exaltación (renombrar a nominacion-2027.ts)
 */

import { EXALTACION_2026 } from "./exaltacion-2026";

export interface PuntoDistribucion {
  readonly nombre: string;
  readonly tipo: "Emisora" | "Periódico" | "Sede principal";
}

export interface CeremoniaInfo {
  readonly fecha: Date;
  /**
   * Sede de la ceremonia. Tipo `string | null` por compatibilidad: los
   * componentes que la consumen DEBEN manejar el caso null sin renderizar
   * placeholders (ej: NO renderizar la sección si lugar === null).
   */
  readonly lugar: string | null;
}

export interface PeriodoNominacion {
  readonly apertura: Date;
  readonly cierre: Date;
}

export interface ContactoInfo {
  readonly telefonoPrincipal: string;
  readonly telefonosAdicionales: readonly string[];
  readonly email: string;
  readonly web: string;
}

/**
 * `url`: ruta del archivo en `/public` (puede llevar versión, ej. -v3.pdf)
 * `downloadFileName`: nombre que verá el usuario en su carpeta Descargas
 *                     (sin sufijo de versión — esto es interno).
 */
export interface PdfAsset {
  readonly url: string;
  readonly downloadFileName: string;
}

export interface DocumentosInfo {
  readonly boleta: PdfAsset;
  readonly comunicado: PdfAsset;
}

export interface NominacionData {
  readonly exaltacionNumero: number;
  readonly exaltacionOrdinal: string;
  readonly ceremonia: CeremoniaInfo;
  readonly periodo: PeriodoNominacion;
  readonly categorias: readonly string[];
  readonly puntosDistribucion: readonly PuntoDistribucion[];
  readonly contacto: ContactoInfo;
  readonly documentos: DocumentosInfo;
}

export const NOMINACION_2026: NominacionData = {
  exaltacionNumero: 9,
  exaltacionOrdinal: "Novena",
  ceremonia: {
    // Derivado de EXALTACION_2026. Para cambiar fecha, hora o sede,
    // editar src/lib/data/exaltacion-2026.ts (sede confirmada: flyer oficial 2026-10-12).
    fecha: EXALTACION_2026.inicio,
    lugar: EXALTACION_2026.sede.nombre,
  },
  periodo: {
    apertura: new Date("2026-05-22T08:00:00-04:00"),
    cierre: new Date("2026-08-31T16:00:00-04:00"),
  },
  categorias: ["Atleta", "Propulsor", "Cronista deportivo"],
  puntosDistribucion: [
    { nombre: "Walo Radio", tipo: "Emisora" },
    { nombre: "Periódico El Oriental", tipo: "Periódico" },
    { nombre: "Radio Victoria", tipo: "Emisora" },
    { nombre: "Centro Cultural Antonia Sáez", tipo: "Sede principal" },
  ],
  contacto: {
    telefonoPrincipal: "787-410-1237",
    telefonosAdicionales: ["787-209-8250", "787-559-4013", "787-438-0585"],
    email: "informa@pfdh.org",
    web: "https://pfdh.org",
  },
  documentos: {
    boleta: {
      url: "/documentos/boleta-nominacion-pfdh-v3.pdf",
      downloadFileName: "boleta-nominacion-pfdh.pdf",
    },
    comunicado: {
      url: "/documentos/comunicado-prensa-9na-exaltacion.pdf",
      downloadFileName: "comunicado-prensa-9na-exaltacion.pdf",
    },
  },
};
