/// <reference types="@testing-library/jest-dom/vitest" />
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import CalendarioPage from '@/app/calendario/page';
import type { EventoSerializado } from '@/lib/types';

// El mock global de next/image (tests/setup) devuelve las props en vez de un elemento.
vi.mock('next/image', () => ({
  default: ({ src, alt, className }: { src: string; alt: string; className?: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={className} />
  ),
}));

/** Ceremonia de Google Calendar el mismo día AST que la Novena Exaltación (2026-11-08). */
const CEREMONIA_GCAL = {
  id: 'gcal-exaltacion',
  titulo: 'Ceremonia de Exaltación (Google Calendar)',
  descripcion: 'Evento duplicado de Google Calendar',
  fecha: '2026-11-08',
  horaInicio: '1:00 p.m.',
  ubicacion: 'Centro de Bellas Artes',
  tipo: 'ceremonia',
} as unknown as EventoSerializado;

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  cleanup();
});

function simularApi(eventos: EventoSerializado[]): void {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => ({
      ok: true,
      json: async () => ({ success: true, data: eventos }),
    })),
  );
}

describe('/calendario: tarjeta «Próximo gran evento» (PF-072)', () => {
  it('el HTML del servidor incluye la tarjeta antes del evento (2026-11-07)', () => {
    vi.setSystemTime(new Date('2026-11-07T12:00:00-04:00'));
    const html = renderToString(<CalendarioPage />);
    expect(html).toContain('Próximo gran evento');
  });

  it('el HTML del servidor NO incluye la tarjeta tras el evento (2026-11-09)', () => {
    vi.setSystemTime(new Date('2026-11-09T12:00:00-04:00'));
    const html = renderToString(<CalendarioPage />);
    expect(html).not.toContain('Próximo gran evento');
    expect(html).toContain('Calendario de Actividades');
  });

  it('antes del evento la ceremonia duplicada de Google Calendar se oculta', async () => {
    vi.setSystemTime(new Date('2026-11-07T12:00:00-04:00'));
    simularApi([CEREMONIA_GCAL]);
    render(<CalendarioPage />);
    expect(screen.getByText('Próximo gran evento')).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByText('Cargando eventos...')).not.toBeInTheDocument());
    expect(screen.queryByText(CEREMONIA_GCAL.titulo)).not.toBeInTheDocument();
  });

  it('tras el evento la ceremonia del 2026-11-08 de Google Calendar NO se filtra', async () => {
    vi.setSystemTime(new Date('2026-11-09T12:00:00-04:00'));
    simularApi([CEREMONIA_GCAL]);
    render(<CalendarioPage />);
    expect(screen.queryByText('Próximo gran evento')).not.toBeInTheDocument();
    expect(await screen.findByText(CEREMONIA_GCAL.titulo)).toBeInTheDocument();
  });
});
