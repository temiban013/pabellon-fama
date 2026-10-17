'use client';

import React from 'react';
import { useCuentaRegresiva } from '@/hooks/useCuentaRegresiva';
import { formatearHoraAST, getFaseEvento } from '@/lib/exaltacion';
import { EXALTACION_2026 } from '@/lib/data/exaltacion-2026';
import { cn } from '@/lib/utils';

export interface CuentaRegresivaExaltacionProps {
  /** "oscuro" para fondos blue-900; "claro" para fondos blancos. Por defecto "oscuro". */
  variante?: 'oscuro' | 'claro';
  className?: string;
}

const ALTURA_VALOR = 'h-10';
// Altura mínima común a las fases "proxima" y "hoy" para evitar CLS entre esqueleto y valor real.
const CONTENEDOR = 'flex min-h-[6.5rem] flex-col justify-center text-center';

const ESTILOS = {
  oscuro: {
    titulo: 'text-white',
    valor: 'text-pabellon-gold-400',
    etiqueta: 'text-blue-100',
    detalle: 'text-blue-100',
  },
  claro: {
    titulo: 'text-blue-900',
    valor: 'text-pabellon-green-700',
    etiqueta: 'text-gray-600',
    detalle: 'text-gray-700',
  },
} as const;

const TITULO_PROXIMA = 'Faltan para la Novena Exaltación';

/**
 * Cuenta regresiva de la Novena Exaltación (EXALTACION_2026.inicio).
 * Fases: proxima (cuenta) y hoy (aviso). La fase "realizada" no se renderiza
 * aquí: la oculta VisibleHasta. SSR y primer render cliente muestran el
 * esqueleto, con las mismas dimensiones que el valor real (sin CLS).
 */
export function CuentaRegresivaExaltacion({
  variante = 'oscuro',
  className,
}: CuentaRegresivaExaltacionProps): React.JSX.Element | null {
  const { ahora, restante } = useCuentaRegresiva(EXALTACION_2026.inicio);
  const estilos = ESTILOS[variante];

  const fase = ahora === null ? null : getFaseEvento(EXALTACION_2026, ahora);

  if (fase === 'realizada') return null;

  if (fase === 'hoy') {
    return (
      <div role="timer" aria-live="polite" className={cn(CONTENEDOR, className)}>
        <p className={cn('text-xl font-semibold', estilos.titulo)}>
          ¡Hoy es la {EXALTACION_2026.titulo}!
        </p>
        <p className={cn('mt-1 text-sm', estilos.detalle)}>
          {formatearHoraAST(EXALTACION_2026.inicio)} · {EXALTACION_2026.sede.nombre}
        </p>
      </div>
    );
  }

  const celdas: ReadonlyArray<{ etiqueta: string; valor: number | null }> = [
    { etiqueta: 'Días', valor: restante?.days ?? null },
    { etiqueta: 'Horas', valor: restante?.hours ?? null },
    { etiqueta: 'Minutos', valor: restante?.minutes ?? null },
    { etiqueta: 'Segundos', valor: restante?.seconds ?? null },
  ];

  return (
    <div role="timer" aria-live="polite" className={cn(CONTENEDOR, className)}>
      <p className={cn('mb-2 text-sm font-semibold uppercase tracking-wide', estilos.titulo)}>
        {TITULO_PROXIMA}
      </p>
      <div className="grid grid-cols-4 gap-2 sm:gap-4">
        {celdas.map(({ etiqueta, valor }) => (
          <div key={etiqueta}>
            <div
              className={cn(
                ALTURA_VALOR,
                'flex items-center justify-center text-3xl font-bold tabular-nums',
                estilos.valor,
              )}
            >
              {valor === null ? '—' : String(valor).padStart(2, '0')}
            </div>
            <div className={cn('text-xs uppercase tracking-wide', estilos.etiqueta)}>
              {etiqueta}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
