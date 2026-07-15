import { describe, it, expect } from 'vitest';
import {
  noticias,
  getNoticias,
  getNoticiaBySlug,
  getUltimasNoticias,
  type Noticia,
} from '@/data/noticias';
import { todosLosExaltados } from '@/data/exaltados-all';

// Fixtures para probar el comportamiento de los helpers con datos
// controlados (el arreglo real está vacío hasta la Fase 5 de PF-051).
const fixture: readonly Noticia[] = [
  {
    slug: 'anuncio-antiguo',
    titulo: 'Anuncio antiguo',
    fecha: '2026-05-09',
    categoria: 'anuncio',
    resumen: 'Un anuncio antiguo.',
    contenido: ['Párrafo único.'],
  },
  {
    slug: 'evento-reciente',
    titulo: 'Evento reciente',
    fecha: '2026-07-14',
    categoria: 'evento',
    resumen: 'El evento más reciente.',
    contenido: ['Primer párrafo.', 'Segundo párrafo.'],
  },
  {
    slug: 'en-memoria-intermedio',
    titulo: 'En memoria',
    fecha: '2026-07-13',
    categoria: 'en-memoria',
    resumen: 'Nota en memoria intermedia.',
    contenido: ['Párrafo.'],
    exaltadoSlug: 'julio-yuyo-maldonado',
  },
];

describe('data/noticias.ts', () => {
  describe('getNoticias', () => {
    it('ordena descendente por fecha (más reciente primero)', () => {
      const resultado = getNoticias(fixture);
      expect(resultado.map((n) => n.slug)).toEqual([
        'evento-reciente',
        'en-memoria-intermedio',
        'anuncio-antiguo',
      ]);
    });

    it('no muta el arreglo fuente', () => {
      const copia = [...fixture];
      getNoticias(fixture);
      expect(fixture).toEqual(copia);
    });

    it('devuelve arreglo vacío cuando no hay noticias', () => {
      expect(getNoticias([])).toEqual([]);
    });
  });

  describe('getNoticiaBySlug', () => {
    it('encuentra una noticia por su slug', () => {
      const noticia = getNoticiaBySlug('en-memoria-intermedio', fixture);
      expect(noticia).toBeDefined();
      expect(noticia?.titulo).toBe('En memoria');
    });

    it('devuelve undefined para un slug desconocido', () => {
      expect(getNoticiaBySlug('no-existe', fixture)).toBeUndefined();
    });
  });

  describe('getUltimasNoticias', () => {
    it('devuelve las n más recientes en orden descendente', () => {
      const ultimas = getUltimasNoticias(2, fixture);
      expect(ultimas.map((n) => n.slug)).toEqual([
        'evento-reciente',
        'en-memoria-intermedio',
      ]);
    });

    it('devuelve todas si n excede el total', () => {
      expect(getUltimasNoticias(10, fixture)).toHaveLength(fixture.length);
    });

    it('devuelve arreglo vacío con n = 0', () => {
      expect(getUltimasNoticias(0, fixture)).toEqual([]);
    });
  });

  // Invariantes sobre el contenido REAL publicado (Fase 5 en adelante).
  // Pasan de forma vacía mientras el arreglo esté vacío.
  describe('invariantes del contenido publicado', () => {
    it('los slugs son únicos', () => {
      const slugs = noticias.map((n) => n.slug);
      expect(new Set(slugs).size).toBe(slugs.length);
    });

    it('los slugs son kebab-case válidos', () => {
      for (const n of noticias) {
        expect(n.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      }
    });

    it('cada resumen tiene 160 caracteres o menos', () => {
      for (const n of noticias) {
        expect(n.resumen.length).toBeLessThanOrEqual(160);
      }
    });

    it('cada fecha es ISO YYYY-MM-DD', () => {
      for (const n of noticias) {
        expect(n.fecha).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      }
    });

    it('cada exaltadoSlug existe en todosLosExaltados (id vivo del directorio)', () => {
      const idsVivos = new Set(todosLosExaltados.map((e) => e.id));
      for (const n of noticias) {
        if (n.exaltadoSlug !== undefined) {
          expect(
            idsVivos.has(n.exaltadoSlug),
            `exaltadoSlug "${n.exaltadoSlug}" (noticia "${n.slug}") no existe en el directorio`
          ).toBe(true);
        }
      }
    });

    it('cada contenido tiene al menos un párrafo no vacío', () => {
      for (const n of noticias) {
        expect(n.contenido.length).toBeGreaterThan(0);
        for (const parrafo of n.contenido) {
          expect(parrafo.trim().length).toBeGreaterThan(0);
        }
      }
    });
  });
});
