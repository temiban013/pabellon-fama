import { describe, it, expect } from 'vitest';
import { join } from 'node:path';
import {
  fusionarManifiesto,
  resolverDirectorioOrigen,
  DIRECTORIO_PDFS_POR_DEFECTO,
} from '../../../scripts/blob/manifiesto';
import manifestReal from '@/data/revistas/blob-manifest.json';

/**
 * PF-077: `upload-revistas.ts` solo escribía los PDF de la carpeta de origen y,
 * corrido para la revista 9 sola, habría dejado una única entrada en el
 * manifiesto (rompiendo las otras revistas y sus redirects 308). Estas pruebas
 * fijan la fusión y la resolución de la carpeta de origen.
 */

const BASE = 'https://abc123.public.blob.vercel-storage.com/revistas';

describe('fusionarManifiesto', () => {
  const existente = {
    'revista-01.pdf': `${BASE}/revista-01.pdf`,
    'revista-08.pdf': `${BASE}/revista-08.pdf`,
    'revista-inauguracion.pdf': `${BASE}/revista-inauguracion.pdf`,
  };

  it('añade la revista nueva sin perder ninguna entrada existente', () => {
    const resultado = fusionarManifiesto(existente, {
      'revista-09.pdf': `${BASE}/revista-09.pdf`,
    });

    expect(Object.keys(resultado)).toHaveLength(4);
    for (const [nombre, url] of Object.entries(existente)) {
      expect(resultado[nombre]).toBe(url);
    }
    expect(resultado['revista-09.pdf']).toBe(`${BASE}/revista-09.pdf`);
  });

  it('la URL nueva sustituye a la existente de la misma clave', () => {
    const nueva = `${BASE}/revista-08.pdf?v=2`;
    const resultado = fusionarManifiesto(existente, { 'revista-08.pdf': nueva });

    expect(resultado['revista-08.pdf']).toBe(nueva);
    expect(Object.keys(resultado)).toHaveLength(3);
  });

  it('devuelve las claves ordenadas, sin importar el orden de entrada', () => {
    const resultado = fusionarManifiesto(
      { 'revista-inauguracion.pdf': `${BASE}/i.pdf`, 'revista-01.pdf': `${BASE}/1.pdf` },
      { 'revista-09.pdf': `${BASE}/9.pdf` },
    );

    expect(Object.keys(resultado)).toEqual([
      'revista-01.pdf',
      'revista-09.pdf',
      'revista-inauguracion.pdf',
    ]);
  });

  it('sin entradas nuevas devuelve una copia igual al existente', () => {
    const resultado = fusionarManifiesto(existente, {});

    expect(resultado).toEqual(existente);
    expect(resultado).not.toBe(existente);
  });

  it('con manifiesto existente vacío devuelve solo las nuevas', () => {
    expect(fusionarManifiesto({}, { 'revista-09.pdf': `${BASE}/9.pdf` })).toEqual({
      'revista-09.pdf': `${BASE}/9.pdf`,
    });
  });

  it('no muta los argumentos', () => {
    const copiaExistente = structuredClone(existente);
    const nuevas = { 'revista-09.pdf': `${BASE}/9.pdf` };
    const copiaNuevas = structuredClone(nuevas);

    fusionarManifiesto(existente, nuevas);

    expect(existente).toEqual(copiaExistente);
    expect(nuevas).toEqual(copiaNuevas);
  });

  it.each(['', 'http://inseguro.example/revista-09.pdf', '/revistas/completas/revista-09.pdf'])(
    'rechaza una URL nueva que no es https:// ("%s") sin tocar lo existente',
    (url) => {
      expect(() => fusionarManifiesto(existente, { 'revista-09.pdf': url })).toThrow(/revista-09\.pdf/);
    },
  );

  it('sobre el manifiesto real, añadir la revista 9 conserva las 9 entradas actuales', () => {
    const resultado = fusionarManifiesto(manifestReal, {
      'revista-09.pdf': `${BASE}/revista-09.pdf`,
    });

    for (const [nombre, url] of Object.entries(manifestReal)) {
      expect(resultado[nombre as keyof typeof manifestReal]).toBe(url);
    }
    expect(Object.keys(resultado)).toHaveLength(Object.keys(manifestReal).length + 1);
  });
});

describe('resolverDirectorioOrigen', () => {
  const cwd = '/repo/pabellon-fama';

  it('sin argumentos usa public/revistas/completas bajo el directorio actual', () => {
    expect(resolverDirectorioOrigen([], cwd)).toBe(join(cwd, DIRECTORIO_PDFS_POR_DEFECTO));
    expect(DIRECTORIO_PDFS_POR_DEFECTO).toBe('public/revistas/completas');
  });

  it('una ruta relativa se resuelve contra el directorio actual', () => {
    expect(resolverDirectorioOrigen(['.media-staging/revistas'], cwd)).toBe(
      join(cwd, '.media-staging/revistas'),
    );
  });

  it('una ruta absoluta se respeta tal cual', () => {
    expect(resolverDirectorioOrigen(['/otra/carpeta'], cwd)).toBe('/otra/carpeta');
  });

  it('un argumento vacío cae al valor por defecto', () => {
    expect(resolverDirectorioOrigen([''], cwd)).toBe(join(cwd, DIRECTORIO_PDFS_POR_DEFECTO));
  });

  it('rechaza opciones desconocidas y más de una carpeta', () => {
    expect(() => resolverDirectorioOrigen(['--force'], cwd)).toThrow(/--force/);
    expect(() => resolverDirectorioOrigen(['a', 'b'], cwd)).toThrow(/máximo una carpeta/);
  });
});
