import { describe, it, expect } from 'vitest';
import {
  getFaseEvento,
  excluirDuplicadoDestacado,
  getFaseNominacion,
  aniosDesdeIncorporacion,
  formatearHoraAST,
  formatearFechaLargaAST,
  formatearFechaLargaSinComaAST,
  formatearFechaCortaAST,
} from '@/lib/exaltacion';
import { EXALTACION_2026 } from '@/lib/data/exaltacion-2026';
import { NOMINACION_2026 } from '@/lib/data/nominacion-2026';
import type { EventoSerializado } from '@/lib/types';

describe('getFaseEvento', () => {
  it('proxima: 2026-11-07 23:59 AST', () => {
    expect(getFaseEvento(EXALTACION_2026, new Date('2026-11-07T23:59:00-04:00'))).toBe('proxima');
  });
  it('hoy: 2026-11-08 00:00 AST y 23:59 AST', () => {
    expect(getFaseEvento(EXALTACION_2026, new Date('2026-11-08T00:00:00-04:00'))).toBe('hoy');
    expect(getFaseEvento(EXALTACION_2026, new Date('2026-11-08T23:59:00-04:00'))).toBe('hoy');
  });
  it('hoy: sigue siendo "hoy" después de la 1:00 p.m.', () => {
    expect(getFaseEvento(EXALTACION_2026, new Date('2026-11-08T18:00:00-04:00'))).toBe('hoy');
  });
  it('realizada: desde 2026-11-09 00:00 AST', () => {
    expect(getFaseEvento(EXALTACION_2026, new Date('2026-11-09T00:00:00-04:00'))).toBe('realizada');
  });
  it('usa AST, no UTC: 2026-11-08 21:00 AST (2026-11-09T01:00Z) sigue siendo "hoy"', () => {
    expect(getFaseEvento(EXALTACION_2026, new Date('2026-11-09T01:00:00Z'))).toBe('hoy');
  });
});

function evento(parcial: Partial<EventoSerializado>): EventoSerializado {
  return {
    id: 'x',
    titulo: 'Evento',
    descripcion: '',
    fecha: '2026-11-08T17:00:00.000Z',
    horaInicio: '01:00 p. m.',
    ubicacion: '',
    tipo: 'ceremonia',
    estado: 'programado',
    requiresRegistro: false,
    ...parcial,
  };
}

describe('excluirDuplicadoDestacado', () => {
  it('quita la ceremonia del mismo día', () => {
    const lista = [evento({ id: 'a' })];
    expect(excluirDuplicadoDestacado(lista, EXALTACION_2026)).toEqual([]);
  });
  it('quita la ceremonia del mismo día aunque sea de todo el día (YYYY-MM-DD)', () => {
    const lista = [evento({ id: 'a', fecha: '2026-11-08' })];
    expect(excluirDuplicadoDestacado(lista, EXALTACION_2026)).toEqual([]);
  });
  it('conserva una reunión el mismo día', () => {
    const lista = [evento({ id: 'r', tipo: 'reunion' })];
    expect(excluirDuplicadoDestacado(lista, EXALTACION_2026)).toEqual(lista);
  });
  it('conserva una ceremonia de otro día', () => {
    const lista = [evento({ id: 'o', fecha: '2026-12-01T17:00:00.000Z' })];
    expect(excluirDuplicadoDestacado(lista, EXALTACION_2026)).toEqual(lista);
  });
  it('no muta la lista original', () => {
    const lista = [evento({ id: 'a' }), evento({ id: 'r', tipo: 'reunion' })];
    const copia = [...lista];
    excluirDuplicadoDestacado(lista, EXALTACION_2026);
    expect(lista).toEqual(copia);
  });
});

describe('getFaseNominacion', () => {
  const { periodo } = NOMINACION_2026;
  it('pre-apertura antes del 2026-05-22', () => {
    expect(getFaseNominacion(periodo, new Date('2026-05-21T12:00:00-04:00'))).toBe('pre-apertura');
  });
  it('activo el 2026-06-01', () => {
    expect(getFaseNominacion(periodo, new Date('2026-06-01T12:00:00-04:00'))).toBe('activo');
  });
  it('cerrado el 2026-09-01', () => {
    expect(getFaseNominacion(periodo, new Date('2026-09-01T12:00:00-04:00'))).toBe('cerrado');
  });
  it('bordes: apertura exacta es activo; cierre exacto es cerrado', () => {
    expect(getFaseNominacion(periodo, periodo.apertura)).toBe('activo');
    expect(getFaseNominacion(periodo, periodo.cierre)).toBe('cerrado');
  });
});

describe('aniosDesdeIncorporacion', () => {
  it('2026-10-17 → 27', () => {
    expect(aniosDesdeIncorporacion(new Date('2026-10-17T12:00:00-04:00'))).toBe(27);
  });
  it('2026-12-21 → 27', () => {
    expect(aniosDesdeIncorporacion(new Date('2026-12-21T12:00:00-04:00'))).toBe(27);
  });
  it('2026-12-22 → 28', () => {
    expect(aniosDesdeIncorporacion(new Date('2026-12-22T12:00:00-04:00'))).toBe(28);
  });
  it('bordes en AST: 2026-12-21 23:59 AST → 27; 2026-12-22 00:00 AST → 28', () => {
    expect(aniosDesdeIncorporacion(new Date('2026-12-21T23:59:59-04:00'))).toBe(27);
    expect(aniosDesdeIncorporacion(new Date('2026-12-22T00:00:00-04:00'))).toBe(28);
  });
  it('AST y no UTC: 2026-12-22T02:00Z (21 dic 22:00 AST) → 27', () => {
    expect(aniosDesdeIncorporacion(new Date('2026-12-22T02:00:00Z'))).toBe(27);
  });
});

describe('formatearHoraAST', () => {
  it('1:00 p.m. para el inicio de la Exaltación', () => {
    expect(formatearHoraAST(EXALTACION_2026.inicio)).toBe('1:00 p.m.');
    expect(formatearHoraAST(new Date('2026-11-08T13:00:00-04:00'))).toBe('1:00 p.m.');
  });
  it('hora a.m. sin cero a la izquierda', () => {
    expect(formatearHoraAST(new Date('2026-03-05T09:07:00-04:00'))).toBe('9:07 a.m.');
  });
  it('mediodía es 12:00 p.m. y 12:30 p.m.', () => {
    expect(formatearHoraAST(new Date('2026-11-08T12:00:00-04:00'))).toBe('12:00 p.m.');
    expect(formatearHoraAST(new Date('2026-11-08T12:30:00-04:00'))).toBe('12:30 p.m.');
  });
  it('medianoche es 12:00 a.m. y 12:05 a.m.', () => {
    expect(formatearHoraAST(new Date('2026-11-08T00:00:00-04:00'))).toBe('12:00 a.m.');
    expect(formatearHoraAST(new Date('2026-11-08T00:05:00-04:00'))).toBe('12:05 a.m.');
  });
  it('usa AST, no UTC', () => {
    expect(formatearHoraAST(new Date('2026-11-09T01:00:00Z'))).toBe('9:00 p.m.');
  });
});

describe('formatearFechaLargaAST', () => {
  it('domingo, 8 de noviembre de 2026', () => {
    expect(formatearFechaLargaAST(EXALTACION_2026.inicio)).toBe('domingo, 8 de noviembre de 2026');
  });
  it('otro mes y día de la semana', () => {
    expect(formatearFechaLargaAST(new Date('2027-03-01T10:00:00-04:00'))).toBe('lunes, 1 de marzo de 2027');
    expect(formatearFechaLargaAST(new Date('2026-12-26T10:00:00-04:00'))).toBe('sábado, 26 de diciembre de 2026');
  });
  it('usa el día AST: 2026-11-09T01:00Z sigue siendo domingo 8', () => {
    expect(formatearFechaLargaAST(new Date('2026-11-09T01:00:00Z'))).toBe('domingo, 8 de noviembre de 2026');
  });
});

describe('formatearFechaLargaSinComaAST', () => {
  it('da la fecha larga sin coma, para ir dentro de una frase', () => {
    expect(formatearFechaLargaSinComaAST(EXALTACION_2026.inicio)).toBe('domingo 8 de noviembre de 2026');
    expect(formatearFechaLargaSinComaAST(new Date('2026-11-09T01:00:00Z'))).toBe('domingo 8 de noviembre de 2026');
  });
});

describe('formatearFechaCortaAST', () => {
  it('8 nov', () => {
    expect(formatearFechaCortaAST(EXALTACION_2026.inicio)).toBe('8 nov');
  });
  it('otros meses', () => {
    expect(formatearFechaCortaAST(new Date('2026-01-15T10:00:00-04:00'))).toBe('15 ene');
    expect(formatearFechaCortaAST(new Date('2026-09-02T10:00:00-04:00'))).toBe('2 sep');
  });
});
