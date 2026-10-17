'use client';

import React from 'react';
import { useCuentaRegresiva, computeTimeLeft } from '@/hooks/useCuentaRegresiva';

export interface CountdownTimerProps {
  apertura: Date;
  cierre: Date;
  ceremonia: Date;
}

type CountdownState = 'pre-apertura' | 'activo' | 'post-cierre' | 'post-ceremonia';

function getState(now: Date, apertura: Date, cierre: Date, ceremonia: Date): CountdownState {
  if (now < apertura) return 'pre-apertura';
  if (now < cierre) return 'activo';
  if (now < ceremonia) return 'post-cierre';
  return 'post-ceremonia';
}

// State narrowed to non-terminal states; callers must handle 'post-ceremonia'
// separately before calling this. This eliminates the need for an `as Date`
// cast at the call site since the return type is just Date.
type ActiveCountdownState = Exclude<CountdownState, 'post-ceremonia'>;

function getTarget(state: ActiveCountdownState, apertura: Date, cierre: Date, ceremonia: Date): Date {
  switch (state) {
    case 'pre-apertura': return apertura;
    case 'activo': return cierre;
    case 'post-cierre': return ceremonia;
  }
}

function getHeading(state: CountdownState): string {
  switch (state) {
    case 'pre-apertura': return 'El periodo de nominaciones abre en';
    case 'activo': return 'Cierre del periodo de nominaciones en';
    case 'post-cierre': return 'Novena Exaltación en';
    case 'post-ceremonia': return '';
  }
}

interface CellProps {
  value: number;
  label: string;
}

function Cell({ value, label }: CellProps): React.JSX.Element {
  const display = String(value).padStart(2, '0');
  return (
    <div>
      <div className="text-4xl font-bold text-orange-500">{display}</div>
      <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
    </div>
  );
}

interface PlaceholderCellProps {
  label: string;
}

function PlaceholderCell({ label }: PlaceholderCellProps): React.JSX.Element {
  return (
    <div>
      <div className="text-4xl font-bold text-orange-500">—</div>
      <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
    </div>
  );
}

export function CountdownTimer({ apertura, cierre, ceremonia }: CountdownTimerProps): React.JSX.Element {
  // Hydration-safe: `ahora` is null on SSR and first client render (skeleton),
  // then ticks every second. The target depends on the current state, so the
  // hook's `restante` (computed vs. ceremonia) is not used; we compute it here.
  const { ahora: now } = useCuentaRegresiva(ceremonia);

  if (now === null) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-orange-500 max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold text-blue-900 mb-4 text-center">
          Cargando cuenta regresiva…
        </h2>
        <div
          role="timer"
          aria-live="polite"
          className="grid grid-cols-4 gap-3 sm:gap-6 text-center"
        >
          <PlaceholderCell label="Días" />
          <PlaceholderCell label="Horas" />
          <PlaceholderCell label="Minutos" />
          <PlaceholderCell label="Segundos" />
        </div>
      </div>
    );
  }

  const state = getState(now, apertura, cierre, ceremonia);

  if (state === 'post-ceremonia') {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-orange-500 max-w-3xl mx-auto">
        <p className="text-center text-gray-700">
          La ceremonia ya se llevó a cabo. ¡Gracias a todos los que participaron!
        </p>
      </div>
    );
  }

  // `state` is narrowed to ActiveCountdownState by the early return above.
  const target = getTarget(state, apertura, cierre, ceremonia);
  const { days, hours, minutes, seconds } = computeTimeLeft(target, now);
  const heading = getHeading(state);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-orange-500 max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold text-blue-900 mb-4 text-center">{heading}</h2>
      <div
        role="timer"
        aria-live="polite"
        className="grid grid-cols-4 gap-3 sm:gap-6 text-center"
      >
        <Cell value={days} label="Días" />
        <Cell value={hours} label="Horas" />
        <Cell value={minutes} label="Minutos" />
        <Cell value={seconds} label="Segundos" />
      </div>
    </div>
  );
}
