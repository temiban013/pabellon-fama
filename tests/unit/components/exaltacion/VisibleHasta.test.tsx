/// <reference types="@testing-library/jest-dom/vitest" />
import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { VisibleHasta } from '@/components/exaltacion/VisibleHasta';
import { CuentaRegresivaExaltacion } from '@/components/exaltacion/CuentaRegresivaExaltacion';
import { EXALTACION_2026 } from '@/lib/data/exaltacion-2026';

const HASTA = EXALTACION_2026.inicio.toISOString();

afterEach(() => {
  vi.useRealTimers();
  cleanup();
});

describe('VisibleHasta', () => {
  it('el render de servidor siempre incluye los children (incluso después del evento)', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-09T12:00:00-04:00'));
    const html = renderToString(
      <VisibleHasta hasta={HASTA}>
        <p>Contenido temporal</p>
      </VisibleHasta>,
    );
    expect(html).toContain('Contenido temporal');
  });

  it('antes del evento: muestra los children tras montar', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-01T12:00:00-04:00'));
    render(
      <VisibleHasta hasta={HASTA}>
        <p>Contenido temporal</p>
      </VisibleHasta>,
    );
    expect(screen.getByText('Contenido temporal')).toBeInTheDocument();
  });

  it('el día del evento: sigue visible', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-08T20:00:00-04:00'));
    render(
      <VisibleHasta hasta={HASTA}>
        <p>Contenido temporal</p>
      </VisibleHasta>,
    );
    expect(screen.getByText('Contenido temporal')).toBeInTheDocument();
  });

  it('desde 2026-11-09 AST: devuelve null tras montar', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-09T00:00:00-04:00'));
    render(
      <VisibleHasta hasta={HASTA}>
        <p>Contenido temporal</p>
      </VisibleHasta>,
    );
    expect(screen.queryByText('Contenido temporal')).not.toBeInTheDocument();
  });
});

describe('CuentaRegresivaExaltacion', () => {
  it('SSR: renderiza el esqueleto con role="timer"', () => {
    const html = renderToString(<CuentaRegresivaExaltacion />);
    expect(html).toContain('role="timer"');
    expect(html).toContain('aria-live="polite"');
    expect(html).toContain('Faltan para la Novena Exaltación');
  });

  it('fase proxima: muestra los días restantes', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-01T13:00:00-04:00'));
    render(<CuentaRegresivaExaltacion />);
    expect(screen.getByText('Faltan para la Novena Exaltación')).toBeInTheDocument();
    expect(screen.getByText('07')).toBeInTheDocument();
    expect(screen.getByText('Días')).toBeInTheDocument();
  });

  it('fase hoy: muestra el aviso con hora y sede', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-08T15:00:00-04:00'));
    render(<CuentaRegresivaExaltacion />);
    expect(screen.getByText(/¡Hoy es la Novena Exaltación!/)).toBeInTheDocument();
    expect(
      screen.getByText('1:00 p.m. · Centro de Bellas Artes Águedo Mojica Marrero'),
    ).toBeInTheDocument();
  });
});
