// src/lib/date-utils.ts
//
// Utilidades de fecha compartidas (calendario, noticias).
// Extraído de src/app/calendario/page.tsx (PF-051, delta DB) para evitar
// duplicar la corrección del bug de desfase de zona horaria.

// Parse date string in local timezone to prevent timezone shift issues.
// Accepts both bare YYYY-MM-DD (all-day events) and full ISO datetimes
// (timed events, after JSON serialization of a Date). For ISO datetimes,
// we resolve the PR-local calendar date so timezone shift never moves the day.
export const parseDateLocal = (dateString: string): Date => {
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  }
  const prDateStr = new Date(dateString).toLocaleDateString("en-CA", {
    timeZone: "America/Puerto_Rico",
  });
  const [year, month, day] = prDateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
};

/** Fecha histórica: el año solo (`YYYY`) o el día completo (`YYYY-MM-DD`). */
export const FORMATO_FECHA_HISTORICA = /^\d{4}(-\d{2}-\d{2})?$/;

/**
 * Fecha de nacimiento o de fallecimiento para mostrar (PF-088).
 *
 * Las fuentes históricas a veces dan solo el año. `'2022'` se muestra como
 * «2022» y `'2026-05-09'` como «9 de mayo de 2026»; `soloAno` le dice a la
 * página qué etiqueta poner («Año de…» o «Fecha de…»). Cualquier otro texto
 * se devuelve tal cual.
 */
export function formatearFechaHistorica(valor: string): {
  texto: string;
  soloAno: boolean;
} {
  if (/^\d{4}$/.test(valor)) {
    return { texto: valor, soloAno: true };
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
    return {
      texto: parseDateLocal(valor).toLocaleDateString("es-PR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      soloAno: false,
    };
  }
  return { texto: valor, soloAno: false };
}
