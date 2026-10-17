/// <reference types="@testing-library/jest-dom/vitest" />
import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
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

  it('desaparece tras el evento (VisibleHasta)', () => {
    vi.setSystemTime(new Date('2026-11-09T12:00:00-04:00'));
    const { container } = render(<AvisoExaltacion />);
    expect(container).toBeEmptyDOMElement();
  });
});
