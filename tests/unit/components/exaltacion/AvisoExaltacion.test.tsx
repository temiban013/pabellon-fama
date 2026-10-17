/// <reference types="@testing-library/jest-dom/vitest" />
import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { AvisoExaltacion } from '@/components/exaltacion/AvisoExaltacion';

const usePathnameMock = vi.fn<() => string | null>();
vi.mock('next/navigation', () => ({
  usePathname: () => usePathnameMock(),
}));

const RUTA_NOTICIA = '/noticias/novena-exaltacion-2026';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-10-17T12:00:00-04:00'));
});

afterEach(() => {
  vi.useRealTimers();
  usePathnameMock.mockReset();
  cleanup();
});

describe('AvisoExaltacion', () => {
  it('se muestra en /historia con enlace a la noticia', () => {
    usePathnameMock.mockReturnValue('/historia');
    render(<AvisoExaltacion />);
    const enlace = screen.getByRole('link');
    expect(enlace).toHaveAttribute('href', RUTA_NOTICIA);
  });

  it('incluye los textos de escritorio y de móvil del handoff', () => {
    usePathnameMock.mockReturnValue('/historia');
    const { container } = render(<AvisoExaltacion />);
    const texto = container.textContent ?? '';
    expect(texto).toContain(
      'Novena Exaltación · Domingo 8 de noviembre, 1:00 p.m. · Centro de Bellas Artes Águedo Mojica Marrero — Ver detalles →',
    );
    expect(texto).toContain('Novena Exaltación · 8 nov · 1:00 p.m. →');
  });

  it('no es sticky', () => {
    usePathnameMock.mockReturnValue('/historia');
    render(<AvisoExaltacion />);
    expect(screen.getByRole('link').className).not.toMatch(/sticky|fixed/);
  });

  it('está oculto en la página de inicio', () => {
    usePathnameMock.mockReturnValue('/');
    const { container } = render(<AvisoExaltacion />);
    expect(container).toBeEmptyDOMElement();
  });

  it('está oculto en la propia noticia (con o sin barra final)', () => {
    usePathnameMock.mockReturnValue(RUTA_NOTICIA);
    const { container, rerender } = render(<AvisoExaltacion />);
    expect(container).toBeEmptyDOMElement();

    usePathnameMock.mockReturnValue(`${RUTA_NOTICIA}/`);
    rerender(<AvisoExaltacion />);
    expect(container).toBeEmptyDOMElement();
  });

  it('se muestra en otras noticias', () => {
    usePathnameMock.mockReturnValue('/noticias/otra-noticia');
    render(<AvisoExaltacion />);
    expect(screen.getByRole('link')).toHaveAttribute('href', RUTA_NOTICIA);
  });

  it('desaparece tras el evento (VisibleHasta)', () => {
    vi.setSystemTime(new Date('2026-11-09T12:00:00-04:00'));
    usePathnameMock.mockReturnValue('/historia');
    const { container } = render(<AvisoExaltacion />);
    expect(container).toBeEmptyDOMElement();
  });
});
