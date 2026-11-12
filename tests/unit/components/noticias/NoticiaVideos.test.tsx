import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '../../../setup/test-utils';
import NoticiaPage from '@/app/noticias/[slug]/page';
import { noticias } from '@/data/noticias';

vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));

vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  }),
}));

const ID_YOUTUBE = /^[A-Za-z0-9_-]{11}$/;

async function renderDetalle(slug: string) {
  const ui = await NoticiaPage({ params: Promise.resolve({ slug }) });
  return render(ui);
}

describe('videos de las noticias (PF-073)', () => {
  it('todo id de YouTube tiene 11 caracteres válidos y no se repite', () => {
    const ids = noticias.flatMap((n) => [
      ...(n.youtubeId ? [n.youtubeId] : []),
      ...(n.videos ?? []).map((v) => v.youtubeId),
    ]);
    for (const id of ids) {
      expect(id, `id inválido: ${id}`).toMatch(ID_YOUTUBE);
    }
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('todo video de la lista tiene un título no vacío', () => {
    for (const noticia of noticias) {
      for (const video of noticia.videos ?? []) {
        expect(video.titulo.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it('la noticia de la Novena muestra la ceremonia completa y «Momentos en video»', async () => {
    const { container } = await renderDetalle('novena-exaltacion-2026');
    const novena = noticias.find((n) => n.slug === 'novena-exaltacion-2026');
    expect(novena?.youtubeId).toBe('wHCHip8EoJI');
    expect(novena?.videos).toHaveLength(6);

    const titulo = screen.getByRole('heading', { level: 2, name: 'Momentos en video' });
    const seccion = titulo.closest('section');
    expect(seccion).not.toBeNull();
    const clips = within(seccion as HTMLElement).getAllByRole('listitem');
    expect(clips).toHaveLength(6);

    const srcs = [...container.querySelectorAll('iframe')].map((f) => f.getAttribute('src'));
    expect(srcs).toHaveLength(7);
    expect(srcs[0]).toBe('https://www.youtube-nocookie.com/embed/wHCHip8EoJI');
    for (const video of novena?.videos ?? []) {
      expect(srcs).toContain(`https://www.youtube-nocookie.com/embed/${video.youtubeId}`);
      expect(within(seccion as HTMLElement).getByText(video.titulo)).toBeInTheDocument();
    }
  });

  it('bajo la ceremonia completa van el crédito y la nota de la miniatura (PF-075)', async () => {
    const { container } = await renderDetalle('novena-exaltacion-2026');
    const principal = container.querySelector(
      'iframe[src="https://www.youtube-nocookie.com/embed/wHCHip8EoJI"]',
    );
    const pie = principal?.closest('figure')?.querySelector('figcaption');
    expect(pie).not.toBeNull();
    expect(pie?.textContent).toContain('Cámara y edición: Reinaldo Álvarez');
    expect(pie?.textContent).toContain(
      'La miniatura (título y escudo sobre un fotograma del video) se compuso con asistencia de IA.',
    );
    // No se declara ninguna categoría de IA para el video en sí.
    expect(pie?.textContent).not.toMatch(/Este video usa/);
    // Los seis clips no llevan pie de crédito ni nota.
    expect(container.querySelectorAll('figcaption')).toHaveLength(1);
  });

  it('una noticia sin lista de videos no muestra la sección', async () => {
    const sinVideos = noticias.find((n) => !n.videos);
    expect(sinVideos).toBeDefined();
    await renderDetalle(sinVideos?.slug ?? '');
    expect(screen.queryByRole('heading', { name: 'Momentos en video' })).toBeNull();
  });
});
