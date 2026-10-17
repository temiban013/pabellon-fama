'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { EXALTACION_2026 } from '@/lib/data/exaltacion-2026';
import {
  capitalizar,
  formatearFechaCortaAST,
  formatearHoraAST,
  partesFechaAST,
} from '@/lib/exaltacion';
import { VisibleHasta } from '@/components/exaltacion/VisibleHasta';

const RUTA_NOTICIA = `/noticias/${EXALTACION_2026.noticiaSlug}`;
/** En estas rutas el evento ya es el protagonista: el aviso sobra. */
const RUTAS_OCULTAS: readonly string[] = ['/', RUTA_NOTICIA];

const { inicio, sede } = EXALTACION_2026;
const HORA = formatearHoraAST(inicio);
const { diaSemana, dia, mes } = partesFechaAST(inicio);
/** Día de la semana, día y mes, sin coma ni año; derivado de `inicio`. */
const FECHA_ESCRITORIO = `${capitalizar(diaSemana)} ${dia} de ${mes}`;
const FECHA_MOVIL = formatearFechaCortaAST(inicio);

/**
 * Franja global (NO sticky) bajo el Header que anuncia la Novena Exaltación
 * (PF-065 §3.2). Contraste: texto blanco y dorado-400 sobre blue-900.
 */
export function AvisoExaltacion(): React.JSX.Element | null {
  const pathname = usePathname();

  if (pathname !== null && RUTAS_OCULTAS.includes(pathname.replace(/(.)\/$/, '$1'))) {
    return null;
  }

  return (
    <VisibleHasta hasta={EXALTACION_2026.inicio.toISOString()}>
      <Link
        href={RUTA_NOTICIA}
        className="block bg-blue-900 px-4 py-2 text-center text-sm text-white transition-colors hover:bg-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-pabellon-gold-400"
      >
        <span className="hidden sm:inline">
          <strong className="font-semibold text-pabellon-gold-400">Novena Exaltación</strong>
          {` · ${FECHA_ESCRITORIO}, ${HORA} · ${sede.nombre} — `}
          <span className="font-semibold text-pabellon-gold-400 underline">Ver detalles →</span>
        </span>
        <span className="sm:hidden">
          <strong className="font-semibold text-pabellon-gold-400">Novena Exaltación</strong>
          {` · ${FECHA_MOVIL} · ${HORA} →`}
        </span>
      </Link>
    </VisibleHasta>
  );
}
