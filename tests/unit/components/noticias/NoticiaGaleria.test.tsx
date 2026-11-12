import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../../setup/test-utils';
import NoticiaPage, { generateMetadata } from '@/app/noticias/[slug]/page';
import { noticias } from '@/data/noticias';
import { getGaleria } from '@/data/galerias';

vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));

vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  }),
}));

async function renderDetalle(slug: string) {
  const ui = await NoticiaPage({ params: Promise.resolve({ slug }) });
  return render(ui);
}

describe('/noticias/[slug] con galeriaId (PF-073)', () => {
  it('la noticia de la Novena muestra «Galería de la ceremonia» con todas sus fotos', async () => {
    await renderDetalle('novena-exaltacion-2026');
    expect(
      screen.getByRole('heading', { level: 2, name: 'Galería de la ceremonia' }),
    ).toBeInTheDocument();
    const { fotos } = getGaleria('novena-exaltacion-2026');
    expect(screen.getAllByRole('button', { name: /^Ampliar foto/ })).toHaveLength(fotos.length);
  });

  it('una noticia sin galeriaId no muestra la sección', async () => {
    const sinGaleria = noticias.find((n) => !n.galeriaId);
    expect(sinGaleria).toBeDefined();
    await renderDetalle(sinGaleria?.slug ?? '');
    expect(screen.queryByRole('heading', { name: 'Galería de la ceremonia' })).toBeNull();
  });

  it('los metadatos usan la imagen OG de Blob (1200x630) de la noticia', async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: 'novena-exaltacion-2026' }),
    });
    const og = getGaleria('novena-exaltacion-2026').og.src;
    expect(JSON.stringify(metadata.openGraph?.images)).toContain(og);
  });
});
