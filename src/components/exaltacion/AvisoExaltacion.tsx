import React from 'react';
import Link from 'next/link';
import { EXALTACION_2026 } from '@/lib/data/exaltacion-2026';
import {
  capitalizar,
  formatearFechaCortaAST,
  formatearHoraAST,
  partesFechaAST,
} from '@/lib/exaltacion';
import { VisibleHasta } from '@/components/exaltacion/VisibleHasta';

const RUTA_NOTICIA = `/noticias/${EXALTACION_2026.noticiaSlug}`;

const { inicio, sede } = EXALTACION_2026;
const HORA = formatearHoraAST(inicio);
const { diaSemana, dia, mes } = partesFechaAST(inicio);
/** Día de la semana, día y mes, sin coma ni año; derivado de `inicio`. */
const FECHA_ESCRITORIO = `${capitalizar(diaSemana)} ${dia} de ${mes}`;
const FECHA_MOVIL = formatearFechaCortaAST(inicio);

/**
 * Franja global (NO sticky) bajo el Header que anuncia la Novena Exaltación
 * (PF-065 §3.2). Contraste: texto blanco y dorado-400 sobre blue-900.
 *
 * Se renderiza SIEMPRE en el servidor. En Inicio y en la propia noticia el evento ya es
 * el protagonista y el aviso sobra: lo oculta una regla CSS de `globals.css`
 * (`body:has([data-pagina=…]) .aviso-exaltacion`), no la ruta. `usePathname()` en el
 * prerender no es fiable: en Vercel, Inicio llega como "/index" y el aviso se colaba
 * en el HTML y provocaba un error de hidratación (React #418).
 */
export function AvisoExaltacion(): React.JSX.Element {
  return (
    <VisibleHasta hasta={EXALTACION_2026.inicio.toISOString()}>
      <Link
        href={RUTA_NOTICIA}
        className="aviso-exaltacion block bg-blue-900 px-4 py-2 text-center text-sm text-white transition-colors hover:bg-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-pabellon-gold-400"
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
