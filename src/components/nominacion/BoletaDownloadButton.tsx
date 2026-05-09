'use client';

import React, { useState, useEffect } from 'react';
import { Download, Lock, XCircle } from 'lucide-react';

export interface BoletaDownloadButtonProps {
  pdfUrl: string;
  downloadFileName: string;
  apertura: Date;
  cierre: Date;
}

type GateState = 'pre-apertura' | 'activo' | 'post-cierre';

function getGateState(now: Date, apertura: Date, cierre: Date): GateState {
  if (now < apertura) return 'pre-apertura';
  if (now < cierre) return 'activo';
  return 'post-cierre';
}

function fmtFechaConHora(d: Date): string {
  return new Intl.DateTimeFormat('es-PR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'America/Puerto_Rico',
  }).format(d);
}

function fmtFecha(d: Date): string {
  return new Intl.DateTimeFormat('es-PR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Puerto_Rico',
  }).format(d);
}

const BUTTON_BASE_CLASSES =
  'inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition-colors';
const ACTIVE_CLASSES = 'bg-orange-500 hover:bg-orange-600 text-white';
const DISABLED_CLASSES = 'bg-gray-200 text-gray-500 cursor-not-allowed';

export function BoletaDownloadButton({
  pdfUrl,
  downloadFileName,
  apertura,
  cierre,
}: BoletaDownloadButtonProps): React.JSX.Element {
  // `now` starts as null so server-side render and client first-render produce
  // identical markup (the skeleton). Without this, `new Date()` runs at different
  // wall-clock moments on server vs client, causing a React hydration mismatch
  // (same bug we hit with CountdownTimer — see commit log on 2026-05-09).
  // After mount, the effect populates `now` with the real time and ticks every
  // second so the gate flips automatically when apertura / cierre cross the
  // current moment.
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    // Hydration-safe: initialize "now" only after client mount, then tick every
    // second so the apertura/cierre gate flips automatically. setState in this
    // effect is intentional and required to avoid SSR/CSR time mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (now === null) {
    return (
      <div>
        <button
          type="button"
          disabled
          aria-disabled="true"
          className={`${BUTTON_BASE_CLASSES} ${DISABLED_CLASSES}`}
        >
          <Download className="h-5 w-5 mr-2" aria-hidden="true" />
          Descargar boleta oficial
        </button>
        <p className="text-sm text-gray-500 mt-2" aria-live="polite">
          Verificando disponibilidad…
        </p>
      </div>
    );
  }

  const state = getGateState(now, apertura, cierre);

  if (state === 'activo') {
    return (
      <a
        href={pdfUrl}
        download={downloadFileName}
        className={`${BUTTON_BASE_CLASSES} ${ACTIVE_CLASSES}`}
      >
        <Download className="h-5 w-5 mr-2" aria-hidden="true" />
        Descargar boleta oficial
      </a>
    );
  }

  const Icon = state === 'pre-apertura' ? Lock : XCircle;
  const message =
    state === 'pre-apertura'
      ? `El periodo de nominaciones abre el ${fmtFechaConHora(apertura)} (hora de Puerto Rico).`
      : `El periodo de nominaciones cerró el ${fmtFecha(cierre)}.`;

  return (
    <div>
      <button
        type="button"
        disabled
        aria-disabled="true"
        className={`${BUTTON_BASE_CLASSES} ${DISABLED_CLASSES}`}
      >
        <Icon className="h-5 w-5 mr-2" aria-hidden="true" />
        Descargar boleta oficial
      </button>
      <p className="text-sm text-gray-700 mt-2" aria-live="polite">
        {message}
      </p>
    </div>
  );
}
