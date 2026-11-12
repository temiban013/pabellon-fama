import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../../setup/test-utils';
import { GaleriaNoticia } from '@/components/galeria/GaleriaNoticia';
import type { Galeria } from '@/data/galerias/types';

// Mock next/image → <img> simple; expone `unoptimized` para verificar la decisión.
vi.mock('next/image', () => ({
  default: ({ src, alt, unoptimized }: { src: string; alt: string; unoptimized?: boolean }) => (
    <img src={src} alt={alt} data-unoptimized={String(Boolean(unoptimized))} />
  ),
}));

const BLOB = 'https://licijzlydvcugjx5.public.blob.vercel-storage.com/galerias/prueba';

function galeria(credito: string | null = null): Galeria {
  return {
    id: 'prueba',
    titulo: 'Galería de la ceremonia',
    credito,
    portada: { src: `${BLOB}/full/a.webp`, alt: 'A', width: 1600, height: 1067 },
    og: { src: `${BLOB}/og-1200x630.jpg`, alt: 'OG', width: 1200, height: 630 },
    fotos: [
      {
        id: 'invitacion',
        src: '/images/noticias/flyer.jpg',
        thumb: '/images/noticias/flyer.jpg',
        width: 1024,
        height: 1536,
        alt: 'Invitación de prueba',
        categoria: 'invitacion',
        pie: 'La invitación',
      },
      {
        id: 'a',
        src: `${BLOB}/full/a.webp`,
        thumb: `${BLOB}/thumb/a.webp`,
        width: 1600,
        height: 1067,
        alt: 'Foto A de prueba',
        categoria: 'llegada',
      },
      {
        id: 'b',
        src: `${BLOB}/full/b.webp`,
        thumb: `${BLOB}/thumb/b.webp`,
        width: 1067,
        height: 1600,
        alt: 'Foto B de prueba',
        categoria: 'discurso',
        pie: 'Pie B',
      },
    ],
  };
}

describe('GaleriaNoticia', () => {
  it('renderiza el encabezado y un botón por foto con aria-label en español', () => {
    render(<GaleriaNoticia galeria={galeria()} />);
    expect(
      screen.getByRole('heading', { level: 2, name: 'Galería de la ceremonia' }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(3);
    expect(
      screen.getByRole('button', { name: 'Ampliar foto 2 de 3: Foto A de prueba' }),
    ).toBeInTheDocument();
  });

  it('las miniaturas remotas (Blob) van sin optimizador; las locales con optimizador', () => {
    const { container } = render(<GaleriaNoticia galeria={galeria()} />);
    const imgs = Array.from(container.querySelectorAll('img'));
    const porSrc = Object.fromEntries(
      imgs.map((i) => [i.getAttribute('src'), i.dataset.unoptimized]),
    );
    expect(porSrc['/images/noticias/flyer.jpg']).toBe('false');
    expect(porSrc[`${BLOB}/thumb/a.webp`]).toBe('true');
  });

  it('muestra el crédito solo si no es null', () => {
    const { rerender } = render(<GaleriaNoticia galeria={galeria()} />);
    expect(screen.queryByText(/^Fotos:/)).toBeNull();
    rerender(<GaleriaNoticia galeria={galeria('Fotos de prueba')} />);
    expect(screen.getByText('Fotos: Fotos de prueba')).toBeInTheDocument();
  });

  it('abre el visor en la foto pulsada, navega con flechas y cierra con Esc devolviendo el foco', async () => {
    render(<GaleriaNoticia galeria={galeria()} />);
    const boton = screen.getByRole('button', { name: /Ampliar foto 2 de 3/ });
    boton.focus();
    fireEvent.click(boton);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Foto 2 de 3')).toBeInTheDocument();
    // la foto completa de Blob también va sin optimizador
    const completa = screen
      .getAllByAltText('Foto A de prueba')
      .find((i) => i.getAttribute('src')?.includes('/full/'));
    expect(completa?.getAttribute('data-unoptimized')).toBe('true');

    fireEvent.keyDown(document, { key: 'ArrowRight' });
    expect(screen.getByText('Foto 3 de 3')).toBeInTheDocument();
    expect(screen.getByText('Pie B')).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'ArrowLeft' });
    fireEvent.keyDown(document, { key: 'ArrowLeft' });
    expect(screen.getByText('Foto 1 de 3')).toBeInTheDocument();
    expect(screen.getByText('La invitación')).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
    await waitFor(() => expect(document.activeElement).toBe(boton));
  });

  it('el visor navega al deslizar (táctil)', () => {
    render(<GaleriaNoticia galeria={galeria()} />);
    fireEvent.click(screen.getByRole('button', { name: /Ampliar foto 1 de 3/ }));
    const zona = screen.getByLabelText('Foto siguiente').parentElement as HTMLElement;
    fireEvent.touchStart(zona, { touches: [{ clientX: 300 }] });
    fireEvent.touchEnd(zona, { changedTouches: [{ clientX: 100 }] });
    expect(screen.getByText('Foto 2 de 3')).toBeInTheDocument();
  });

  it('no renderiza nada si la galería no tiene fotos', () => {
    const { container } = render(<GaleriaNoticia galeria={{ ...galeria(), fotos: [] }} />);
    expect(container).toBeEmptyDOMElement();
  });
});
