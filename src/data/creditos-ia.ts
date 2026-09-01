/**
 * PF-058 · Divulgación del uso de inteligencia artificial en las producciones.
 *
 * Fuente de verdad ÚNICA de los créditos de IA, indexada por `youtubeId`.
 *
 * Por qué un mapa y no un campo en cada récord: el mismo `youtubeId` vive hasta en
 * tres archivos de datos (`visitas.ts`, `noticias.ts` y `revistas/revNN/exaltados.ts`).
 * Declarar el crédito en cada uno lo duplicaría y se desincronizaría — PF-056 ya
 * registra ese dolor («actualizar el id en los 3 archivos de datos»). Aquí se declara
 * una vez y lo consume `YouTubeEmbed`, por el que pasan las tres superficies del sitio.
 *
 * REGLA: cada herramienta se nombra SOLO hasta donde llega su respaldo documental.
 * El `derechos.md` de Josie dice «Google Gemini» a secas; el de Pipá especifica el
 * modelo Lyria. No se uniforman: atribuir Lyria a Josie sería inventar.
 */

export type CategoriaIA = "musica" | "graficos" | "subtitulos" | "investigacion";

export interface CreditoIA {
  /** Categorías que aplican a este video. El orden no importa. */
  readonly categorias: readonly CategoriaIA[];
  /** Herramienta por categoría. Solo se llena donde hay respaldo documental. */
  readonly herramientas: Partial<Record<CategoriaIA, string>>;
}

/** Etiqueta corta de cada categoría, para la nota bajo el video. */
export const ETIQUETAS_CATEGORIA: Readonly<Record<CategoriaIA, string>> = {
  musica: "música",
  graficos: "gráficos",
  subtitulos: "subtítulos",
  investigacion: "investigación",
};

/**
 * Créditos por video.
 *
 * `investigacion` aplica a las cuatro producciones: el dossier de cada entrevista se
 * compiló con asistencia de IA y se verificó contra las revistas del Pabellón.
 */
export const creditosIA: Readonly<Record<string, CreditoIA>> = {
  // Pipá Sierra (PF-055) — expediente completo con prompts archivados.
  nbBzxkL1aTU: {
    categorias: ["musica", "graficos", "subtitulos", "investigacion"],
    herramientas: {
      musica: "Google Gemini (modelo Lyria)",
      graficos: "Claude Design",
      subtitulos: "Whisper",
    },
  },

  // Josie Marrero (PF-053) — su derechos.md NO nombra el modelo Lyria. No añadirlo.
  "UmyJa-N4XEc": {
    categorias: ["musica", "graficos", "subtitulos", "investigacion"],
    herramientas: {
      musica: "Google Gemini",
      subtitulos: "Whisper",
    },
  },

  // Rafa Ocasio (PF-047) — sin `subtitulos`: los suyos siguen pendientes (bandera S1
  // del doc de publicación). Al cerrarse PF-059 hay que añadir la categoría aquí.
  "7mxpxoJmi-g": {
    categorias: ["musica", "graficos", "investigacion"],
    herramientas: {
      musica: "Google Gemini (modelo Lyria)",
      graficos: "Claude Design",
    },
  },

  // Keishla García — SIN música de IA: su audio es el Himno de Humacao, una grabación
  // de terceros (situación de licencia abierta, PF-060). No declarar `musica` aquí.
  "0-6nM8DOyKo": {
    categorias: ["graficos", "investigacion"],
    herramientas: {},
  },
};

/** Devuelve el crédito de un video, o `undefined` si no tiene entrada. */
export function getCreditoIA(youtubeId: string): CreditoIA | undefined {
  return creditosIA[youtubeId];
}

/**
 * Enumeración en minúsculas de las categorías visibles de un video, para encajar en
 * «Este video usa {lista} creados con inteligencia artificial».
 *
 * Se compone en vez de escribirse a mano para que ningún video pueda afirmar algo que
 * su entrada no declare: Keishla, sin `musica`, nunca dirá que su música es de IA.
 *
 * Va en minúscula y sin artículos a propósito: la frase que la envuelve ya aporta el
 * verbo, y así las tres variantes («música y gráficos», «gráficos», «música, gráficos
 * y subtítulos») suenan naturales sin tener que concordar género con cada categoría.
 *
 * Devuelve `null` si el video no tiene crédito registrado o no declara categorías
 * visibles en pantalla.
 */
export function getResumenCreditoIA(youtubeId: string): string | null {
  const credito = getCreditoIA(youtubeId);
  if (!credito || credito.categorias.length === 0) return null;

  // `investigacion` es una categoría de proceso: se explica en /como-se-hace, no en
  // la nota corta, donde solo caben las cosas que se ven u oyen en el video.
  const visibles = credito.categorias.filter((c) => c !== "investigacion");
  if (visibles.length === 0) return null;

  const etiquetas = visibles.map((c) => ETIQUETAS_CATEGORIA[c]);
  if (etiquetas.length === 1) return etiquetas[0];

  return `${etiquetas.slice(0, -1).join(", ")} y ${etiquetas[etiquetas.length - 1]}`;
}
