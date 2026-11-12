import { describe, it, expect } from 'vitest';
import { galerias, getGaleria } from '@/data/galerias';
import { noticias } from '@/data/noticias';
import { CATEGORIAS_FOTO_EVENTO } from '@/data/galerias/types';
import { BLOB_BASE_URL, PATHNAME_OG, urlBlob } from '../../../scripts/galerias/manifiesto';

const PREFIJO_BLOB = `${BLOB_BASE_URL}/galerias/`;

describe('galerías de eventos (datos generados)', () => {
  const galeria = getGaleria('novena-exaltacion-2026');

  it('la primera foto es el flyer local «La invitación»; el resto vive en Vercel Blob', () => {
    const [primera, ...resto] = galeria.fotos;
    expect(primera.id).toBe('invitacion');
    expect(primera.src).toBe('/images/noticias/novena-exaltacion-2026.jpg');
    expect(primera.pie).toBe('La invitación');
    expect(resto.length).toBeGreaterThan(0);
    for (const foto of resto) {
      expect(foto.src.startsWith(PREFIJO_BLOB), `${foto.id} src`).toBe(true);
      expect(foto.thumb.startsWith(PREFIJO_BLOB), `${foto.id} thumb`).toBe(true);
    }
  });

  it('todas las fotos tienen dimensiones positivas, alt no vacío y categoría válida', () => {
    for (const foto of galeria.fotos) {
      expect(foto.width, `${foto.id} width`).toBeGreaterThan(0);
      expect(foto.height, `${foto.id} height`).toBeGreaterThan(0);
      expect(foto.alt.trim().length, `${foto.id} alt`).toBeGreaterThan(0);
      expect(CATEGORIAS_FOTO_EVENTO).toContain(foto.categoria);
    }
  });

  it('los ids son únicos', () => {
    const ids = galeria.fotos.map((f) => f.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('portada y og son URLs de Blob; la portada es una de las fotos; el og es 1200x630', () => {
    expect(galeria.portada.src.startsWith(PREFIJO_BLOB)).toBe(true);
    expect(galeria.fotos.some((f) => f.src === galeria.portada.src)).toBe(true);
    expect(galeria.og.src).toBe(urlBlob(PATHNAME_OG));
    expect(galeria.og.width).toBe(1200);
    expect(galeria.og.height).toBe(630);
    expect(galeria.portada.alt.trim().length).toBeGreaterThan(0);
    expect(galeria.og.alt.trim().length).toBeGreaterThan(0);
  });

  it('el crédito es null o un texto no vacío', () => {
    expect(galeria.credito === null || galeria.credito.trim().length > 0).toBe(true);
  });

  it('el id de la galería coincide con su clave en el registro', () => {
    for (const [clave, g] of Object.entries(galerias)) {
      expect(g.id).toBe(clave);
    }
  });
});

describe('Noticia.galeriaId', () => {
  it('toda noticia con galeriaId apunta a una galería registrada', () => {
    for (const noticia of noticias) {
      if (noticia.galeriaId) {
        expect(galerias[noticia.galeriaId], noticia.slug).toBeDefined();
      }
    }
  });

  it('la noticia de la Novena usa la portada y el og de su galería', () => {
    const noticia = noticias.find((n) => n.slug === 'novena-exaltacion-2026');
    expect(noticia?.galeriaId).toBe('novena-exaltacion-2026');
    const galeria = getGaleria('novena-exaltacion-2026');
    expect(noticia?.imagen).toEqual(galeria.portada);
    expect(noticia?.imagenOg?.src).toBe(urlBlob(PATHNAME_OG));
  });
});
