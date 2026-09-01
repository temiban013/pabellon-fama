import { describe, it, expect } from 'vitest';
import {
  creditosIA,
  getCreditoIA,
  getResumenCreditoIA,
  ETIQUETAS_CATEGORIA,
  type CategoriaIA,
} from '@/data/creditos-ia';
import { visitas } from '@/data/visitas';
import { noticias } from '@/data/noticias';
import { todosLosExaltados } from '@/data/exaltados-all';

/**
 * Reúne todos los youtubeId que el sitio puede renderizar, desde las tres
 * superficies que pasan por YouTubeEmbed.
 */
function youtubeIdsDelSitio(): string[] {
  const ids = [
    ...visitas.map((v) => v.youtubeId),
    ...noticias.map((n) => n.youtubeId),
    ...todosLosExaltados.map((e) => e.entrevistaYoutubeId),
  ].filter((id): id is string => Boolean(id));

  return [...new Set(ids)];
}

describe('creditosIA — cobertura del sitio', () => {
  // Ésta es la prueba que importa: cuando se publique un video nuevo, la suite
  // falla hasta que alguien decida conscientemente sus categorías de IA. Es la
  // barrera que impide repetir el hueco de Rafa Ocasio, publicado en julio sin
  // que su música quedara documentada.
  it('todo video publicado en el sitio tiene crédito declarado', () => {
    const sinCredito = youtubeIdsDelSitio().filter((id) => !getCreditoIA(id));

    expect(
      sinCredito,
      `Videos sin entrada en creditos-ia.ts: ${sinCredito.join(', ')}. ` +
        'Añade su entrada declarando qué categorías aplican (un video sin ' +
        'ninguna categoría de IA se declara con `categorias: []`).',
    ).toEqual([]);
  });

  // Protege contra el problema que PF-056 dejó anotado: el youtubeId vive en
  // varios archivos y si se re-sube un video con otro id, este mapa queda huérfano.
  it('todo crédito declarado corresponde a un video que el sitio usa', () => {
    const idsDelSitio = new Set(youtubeIdsDelSitio());
    const huerfanos = Object.keys(creditosIA).filter((id) => !idsDelSitio.has(id));

    expect(
      huerfanos,
      `Créditos que ya no apuntan a ningún video del sitio: ${huerfanos.join(', ')}. ` +
        '¿Se re-subió el video con otro id?',
    ).toEqual([]);
  });
});

describe('creditosIA — integridad de cada entrada', () => {
  it('no declara herramientas para categorías que no aplican', () => {
    for (const [id, credito] of Object.entries(creditosIA)) {
      const declaradas = new Set<CategoriaIA>(credito.categorias);
      for (const categoria of Object.keys(credito.herramientas) as CategoriaIA[]) {
        expect(
          declaradas.has(categoria),
          `${id} nombra una herramienta para "${categoria}" sin declarar esa categoría`,
        ).toBe(true);
      }
    }
  });

  it('no repite categorías dentro de una entrada', () => {
    for (const [id, credito] of Object.entries(creditosIA)) {
      expect(
        new Set(credito.categorias).size,
        `${id} tiene categorías duplicadas`,
      ).toBe(credito.categorias.length);
    }
  });

  it('toda categoría usada tiene etiqueta en español', () => {
    for (const credito of Object.values(creditosIA)) {
      for (const categoria of credito.categorias) {
        expect(ETIQUETAS_CATEGORIA[categoria]).toBeTruthy();
      }
    }
  });
});

describe('getResumenCreditoIA', () => {
  it('devuelve null para un video sin crédito registrado', () => {
    expect(getResumenCreditoIA('id-que-no-existe')).toBeNull();
  });

  it('enumera varias categorías con coma y "y"', () => {
    // Pipá: música, gráficos y subtítulos (investigación no entra en la nota corta).
    expect(getResumenCreditoIA('nbBzxkL1aTU')).toBe('música, gráficos y subtítulos');
  });

  it('omite la música de un video que no la declara', () => {
    // Keishla usa el Himno de Humacao, que no es IA: su nota no puede mencionarla.
    const resumen = getResumenCreditoIA('0-6nM8DOyKo');
    expect(resumen).toBe('gráficos');
    expect(resumen).not.toMatch(/música/i);
  });

  it('omite los subtítulos de un video que aún no los publica', () => {
    // Ocasio: bandera S1 abierta, sus subtítulos siguen pendientes (PF-059).
    const resumen = getResumenCreditoIA('7mxpxoJmi-g');
    expect(resumen).toBe('música y gráficos');
    expect(resumen).not.toMatch(/subtítulos/i);
  });

  it('no expone "investigación" en la nota corta', () => {
    // Es una categoría de proceso: se explica en /como-se-hace, no bajo el video.
    for (const id of Object.keys(creditosIA)) {
      expect(getResumenCreditoIA(id) ?? '').not.toMatch(/investigación/i);
    }
  });
});
