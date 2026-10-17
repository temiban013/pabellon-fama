'use client';

import { useState, useEffect } from 'react';

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function computeTimeLeft(target: Date, now: Date): TimeLeft {
  const diffMs = Math.max(0, target.getTime() - now.getTime());
  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds };
}

export interface CuentaRegresiva {
  /** null hasta que el componente monta (SSR y primer render cliente idénticos). */
  ahora: Date | null;
  /** Tiempo restante hasta `objetivo`; null hasta que el componente monta. */
  restante: TimeLeft | null;
}

export function useCuentaRegresiva(objetivo: Date): CuentaRegresiva {
  // `ahora` starts as null so server-side render and client first-render produce
  // identical markup (the skeleton). Without this, `new Date()` runs at different
  // wall-clock moments on server vs client, causing a React hydration mismatch.
  // After mount, the effect populates `ahora` with the real time and starts ticking.
  const [ahora, setAhora] = useState<Date | null>(null);

  useEffect(() => {
    // Hydration-safe initialization: see comments above. setState in this effect
    // is required to avoid SSR/CSR mismatch on initial render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAhora(new Date());
    const id = setInterval(() => {
      setAhora(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return {
    ahora,
    restante: ahora === null ? null : computeTimeLeft(objetivo, ahora),
  };
}
