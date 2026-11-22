/**
 * Totales del Pabellón calculados a partir de los datos (PF-074, D101).
 *
 * Los textos de las páginas no escriben estas cifras a mano: las leen de aquí.
 * - personas: entradas de `todosLosExaltados` que no son `EQUIPO`.
 * - equipos: entradas `EQUIPO`.
 * - entradas: personas + equipos.
 * - ceremonias: revistas de exaltación (`getRevistasExaltacion().length`).
 *
 * Las cifras de época (revista de inauguración, blog de Félix, entrada «2015»
 * de /historia) son históricas y se quedan escritas.
 */

import { todosLosExaltados } from "@/data/exaltados-all";
import { getRevistasExaltacion } from "@/data/revistas";
import type { ExaltadoRevista, RevistaMetadata } from "@/lib/types/revista";

export interface TotalesExaltados {
  personas: number;
  equipos: number;
  entradas: number;
  ceremonias: number;
  /** Año de la primera ceremonia de exaltación con revista. */
  primerAnio: number;
  /** Año de la última ceremonia de exaltación con revista. */
  ultimoAnio: number;
}

/** Cálculo puro: facilita probarlo con datos de muestra. */
export function calcularTotalesExaltados(
  exaltados: readonly Pick<ExaltadoRevista, "categoria">[],
  revistasExaltacion: readonly Pick<RevistaMetadata, "year">[],
): TotalesExaltados {
  const equipos = exaltados.filter((e) => e.categoria === "EQUIPO").length;
  const personas = exaltados.length - equipos;
  const anios = revistasExaltacion.map((r) => r.year);
  return {
    personas,
    equipos,
    entradas: exaltados.length,
    ceremonias: revistasExaltacion.length,
    primerAnio: anios.length ? Math.min(...anios) : 0,
    ultimoAnio: anios.length ? Math.max(...anios) : 0,
  };
}

/** Totales del Pabellón con los datos del sitio. */
export function getTotalesExaltados(): TotalesExaltados {
  return calcularTotalesExaltados(todosLosExaltados, getRevistasExaltacion());
}
