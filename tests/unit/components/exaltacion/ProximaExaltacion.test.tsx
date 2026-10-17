/// <reference types="@testing-library/jest-dom/vitest" />
import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { ProximaExaltacion } from '@/components/exaltacion/ProximaExaltacion';
import { EXALTACION_2026 } from '@/lib/data/exaltacion-2026';

// El mock global de next/image no devuelve un elemento; aquí se usa un <img> simple.
vi.mock('next/image', () => ({
  default: ({ src, alt, className }: { src: string; alt: string; className?: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={className} />
  ),
}));

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-10-17T12:00:00-04:00'));
});

afterEach(() => {
  vi.useRealTimers();
  cleanup();
});

describe('ProximaExaltacion', () => {
  it('muestra título, lema, fecha, hora y sede', () => {
    render(<ProximaExaltacion />);
    expect(screen.getByRole('heading', { name: 'Novena Exaltación' })).toBeInTheDocument();
    expect(screen.getByText(`«${EXALTACION_2026.lema}»`)).toBeInTheDocument();
    expect(screen.getByText('Domingo, 8 de noviembre de 2026')).toBeInTheDocument();
    expect(screen.getByText('1:00 p.m.')).toBeInTheDocument();
    expect(screen.getByText(EXALTACION_2026.sede.nombre)).toBeInTheDocument();
  });

  it('enlaza «Ver detalles» a la noticia y «Calendario de actividades» a /calendario', () => {
    render(<ProximaExaltacion />);
    expect(screen.getByRole('link', { name: 'Ver detalles' })).toHaveAttribute(
      'href',
      '/noticias/novena-exaltacion-2026',
    );
    expect(screen.getByRole('link', { name: 'Calendario de actividades' })).toHaveAttribute(
      'href',
      '/calendario',
    );
  });

  it('muestra el flyer completo con su proporción 2:3 y alt del dato fuente', () => {
    render(<ProximaExaltacion />);
    const img = screen.getByAltText(EXALTACION_2026.flyer.alt);
    expect(img).toHaveAttribute('src', expect.stringContaining('novena-exaltacion-2026.jpg'));
    expect(img.className).not.toMatch(/object-cover/);
  });

  it('incluye la cuenta regresiva', () => {
    render(<ProximaExaltacion />);
    expect(screen.getByRole('timer')).toBeInTheDocument();
  });
});
