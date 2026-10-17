import React from 'react';
import { generateCeremonySchema } from '@/lib/schemas/event-schema';
import { EXALTACION_2026 } from '@/lib/data/exaltacion-2026';
import { capitalizar, formatearFechaLargaAST, formatearHoraAST } from '@/lib/exaltacion';

/** JSON-LD `Event` de la Novena Exaltación. Server Component. */
export function ExaltacionJsonLd(): React.JSX.Element {
  const { titulo, lema, sede, inicio } = EXALTACION_2026;

  const schema = generateCeremonySchema({
    name: titulo,
    description: `${titulo} del Pabellón de la Fama del Deporte Humacaeño: «${lema}». ${capitalizar(formatearFechaLargaAST(inicio))}, ${formatearHoraAST(inicio)}, en el ${sede.nombre} de ${sede.municipio}.`,
    // Instante en UTC-4 fijo (AST), con el mismo formato que el origen del dato.
    startDate: toAstIso(inicio),
    location: {
      name: sede.nombre,
      address: `${sede.municipio}, Puerto Rico`,
    },
  });

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/** ISO 8601 con desplazamiento -04:00 (Puerto Rico no usa horario de verano). */
function toAstIso(fecha: Date): string {
  const local = new Date(fecha.getTime() - 4 * 60 * 60 * 1000);
  return `${local.toISOString().slice(0, 19)}-04:00`;
}
