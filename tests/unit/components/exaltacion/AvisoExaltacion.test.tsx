/// <reference types="@testing-library/jest-dom/vitest" />
import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { AvisoExaltacion } from '@/components/exaltacion/AvisoExaltacion';

const RUTA_NOTICIA = '/noticias/novena-exaltacion-2026';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-10-17T12:00:00-04:00'));
});

afterEach(() => {
  vi.useRealTimers();
  cleanup();
});

describe('AvisoExaltacion', () => {
  it('se renderiza con enlace a la noticia', () => {
    render(<AvisoExaltacion />);
    const enlace = screen.getByRole('link');
    expect(enlace).toHaveAttribute('href', RUTA_NOTICIA);
  });

  it('incluye los textos de escritorio y de móvil del handoff', () => {
    const { container } = render(<AvisoExaltacion />);
    const texto = container.textContent ?? '';
    expect(texto).toContain(
      'Novena Exaltación · Domingo 8 de noviembre, 1:00 p.m. · Centro de Bellas Artes Águedo Mojica Marrero — Ver detalles →',
    );
    expect(texto).toContain('Novena Exaltación · 8 nov · 1:00 p.m. →');
  });

  it('no es sticky', () => {
    render(<AvisoExaltacion />);
    expect(screen.getByRole('link').className).not.toMatch(/sticky|fixed/);
  });

  it('siempre se renderiza con la clase aviso-exaltacion (el CSS lo oculta en Inicio y en la noticia)', () => {
    render(<AvisoExaltacion />);
    expect(screen.getByRole('link').className).toMatch(/\baviso-exaltacion\b/);
  });

  it('no renderiza nada una vez realizado el evento (decidido en el servidor, PF-072)', () => {
    vi.setSystemTime(new Date('2026-11-09T12:00:00-04:00'));
    const { container } = render(<AvisoExaltacion />);
    expect(container).toBeEmptyDOMElement();
    expect(container.innerHTML).not.toContain('Ver detalles');
  });

  it('el día del evento (hoy) y la víspera todavía se renderiza', () => {
    for (const fecha of ['2026-11-07T12:00:00-04:00', '2026-11-08T23:00:00-04:00']) {
      vi.setSystemTime(new Date(fecha));
      const { container, unmount } = render(<AvisoExaltacion />);
      expect(container.innerHTML).toContain('aviso-exaltacion');
      unmount();
    }
  });

  it('el HTML del servidor (renderToString) no contiene el aviso tras el evento', () => {
    vi.setSystemTime(new Date('2026-11-09T12:00:00-04:00'));
    expect(renderToString(<AvisoExaltacion />)).toBe('');
    vi.setSystemTime(new Date('2026-11-07T12:00:00-04:00'));
    expect(renderToString(<AvisoExaltacion />)).toContain('Ver detalles');
  });
});
