'use client';

import React, { useState, useEffect } from 'react';
import { getFaseEvento } from '@/lib/exaltacion';

export interface VisibleHastaProps {
  /** Inicio del evento en ISO 8601 (ej. "2026-11-08T13:00:00-04:00"). Serializable desde Server Components. */
  hasta: string;
  children: React.ReactNode;
}

/**
 * Muestra `children` hasta que termina el día del evento (AST).
 * El servidor SIEMPRE renderiza los children (sitio estático generado antes del
 * evento, sin CLS). Tras montar, el cliente devuelve null si el evento ya fue
 * "realizada", de modo que lo temporal desaparece solo sin necesidad de un deploy.
 */
export function VisibleHasta({ hasta, children }: VisibleHastaProps): React.JSX.Element | null {
  const [realizada, setRealizada] = useState(false);

  useEffect(() => {
    // Hydration-safe: the first client render must match the server render
    // (children visible); the real clock is only read after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRealizada(getFaseEvento({ inicio: new Date(hasta) }, new Date()) === 'realizada');
  }, [hasta]);

  if (realizada) return null;
  return <>{children}</>;
}
