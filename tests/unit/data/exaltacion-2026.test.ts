import { describe, it, expect } from 'vitest';
import { EXALTACION_2026 } from '@/lib/data/exaltacion-2026';
import { NOMINACION_2026 } from '@/lib/data/nominacion-2026';

describe('EXALTACION_2026', () => {
  it('inicio es 2026-11-08 1:00 p.m. AST', () => {
    expect(EXALTACION_2026.inicio.toISOString()).toBe('2026-11-08T17:00:00.000Z');
  });
  it('fin es null (la Junta no ha indicado hora de cierre)', () => {
    expect(EXALTACION_2026.fin).toBeNull();
  });
  it('sede y flyer según el flyer oficial', () => {
    expect(EXALTACION_2026.sede).toEqual({
      nombre: 'Centro de Bellas Artes Águedo Mojica Marrero',
      municipio: 'Humacao',
    });
    expect(EXALTACION_2026.flyer.width).toBe(1024);
    expect(EXALTACION_2026.flyer.height).toBe(1536);
    expect(EXALTACION_2026.noticiaSlug).toBe('novena-exaltacion-2026');
  });
});

describe('NOMINACION_2026.ceremonia deriva de EXALTACION_2026', () => {
  it('fecha es 2026-11-08T17:00:00.000Z', () => {
    expect(NOMINACION_2026.ceremonia.fecha.toISOString()).toBe('2026-11-08T17:00:00.000Z');
  });
  it('lugar es la sede de EXALTACION_2026', () => {
    expect(NOMINACION_2026.ceremonia.lugar).toBe(EXALTACION_2026.sede.nombre);
  });
});
