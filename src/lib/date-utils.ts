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
