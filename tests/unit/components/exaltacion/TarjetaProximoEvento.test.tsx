/// <reference types="@testing-library/jest-dom/vitest" />
import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { TarjetaProximoEvento } from '@/components/exaltacion/TarjetaProximoEvento';
import { EXALTACION_2026 } from '@/lib/data/exaltacion-2026';

// El mock global de next/image (tests/setup) devuelve las props en vez de un elemento;
// aquí se sustituye por un <img> para poder verificar el flyer.
vi.mock('next/image', () => ({
  default: ({ src, alt, className }: { src: string; alt: string; className?: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={className} />
  ),
}));

afterEach(() => {
  vi.useRealTimers();
  cleanup();
});

function renderizar(): void {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-10-17T12:00:00-04:00'));
  render(<TarjetaProximoEvento />);
}

describe('TarjetaProximoEvento', () => {
  it('muestra «Próximo gran evento», el título y el lema', () => {
    renderizar();
    expect(screen.getByText('Próximo gran evento')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: EXALTACION_2026.titulo }),
    ).toBeInTheDocument();
    expect(screen.getByText(`«${EXALTACION_2026.lema}»`)).toBeInTheDocument();
  });

  it('muestra la sede, la fecha y la hora en America/Puerto_Rico', () => {
    renderizar();
    expect(
      screen.getByText(`${EXALTACION_2026.sede.nombre}, ${EXALTACION_2026.sede.municipio}`),
    ).toBeInTheDocument();
    expect(screen.getByText('Domingo, 8 de noviembre de 2026')).toBeInTheDocument();
    expect(screen.getByText('1:00 p.m.')).toBeInTheDocument();
  });

  it('el enlace «Ver detalles» apunta a la noticia', () => {
    renderizar();
    const enlace = screen.getByRole('link', { name: 'Ver detalles' });
    expect(enlace).toHaveAttribute('href', `/noticias/${EXALTACION_2026.noticiaSlug}`);
  });

  it('incluye el flyer con su texto alternativo y la cuenta regresiva', () => {
    renderizar();
    expect(screen.getByAltText(EXALTACION_2026.flyer.alt)).toBeInTheDocument();
    expect(screen.getByRole('timer')).toBeInTheDocument();
  });
});
