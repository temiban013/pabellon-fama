/**
 * Datos oficiales de la 9na Exaltación 2026.
 * Fuente: Comunicado de prensa oficial de la Junta de Directores PFDH
 * (public/documentos/comunicado-prensa-9na-exaltacion.pdf).
 *
 * EDITAR ESTE ARCHIVO únicamente cuando:
 *  - La Junta confirme la sede de la ceremonia (campo `ceremonia.lugar`)
 *  - Cambien fechas oficiales del periodo o ceremonia
 *  - Se actualicen teléfonos de contacto o puntos de distribución
 *  - Se proceda a la 10ma exaltación (renombrar a nominacion-2027.ts)
 */

export interface PuntoDistribucion {
  readonly nombre: string;
  readonly tipo: "Emisora" | "Periódico" | "Sede principal";
}

export interface CeremoniaInfo {
  readonly fecha: Date;
  /**
   * Sede de la ceremonia. `null` mientras la Junta no la confirme oficialmente.
   * Cuando se confirme, sustituir `null` por el string con el nombre de la sede.
   * Los componentes que la consumen DEBEN manejar el caso null sin renderizar
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
    fecha: new Date("2026-11-08T15:00:00-04:00"),
    // ⚠️ EDITAR AQUÍ cuando la Junta confirme la sede de la ceremonia.
    // Mantener `null` significa que el componente NO mostrará la sede.
    lugar: null,
  },
  periodo: {
    apertura: new Date("2026-05-15T08:00:00-04:00"),
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
