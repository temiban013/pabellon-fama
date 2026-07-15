import { describe, it, expect } from 'vitest';
import { parseDateLocal } from '@/lib/date-utils';

// Cubre la extracción de parseDateLocal desde calendario (PF-051, delta DB):
// la semántica debe permanecer idéntica para que calendario siga verde.
describe('lib/date-utils.ts', () => {
  describe('parseDateLocal', () => {
    it('interpreta YYYY-MM-DD en hora local (sin desfase UTC)', () => {
      const fecha = parseDateLocal('2026-07-13');
      expect(fecha.getFullYear()).toBe(2026);
      expect(fecha.getMonth()).toBe(6); // julio (0-index)
      expect(fecha.getDate()).toBe(13);
    });

    it('no retrocede el día para fechas bare (bug clásico de new Date)', () => {
      // new Date("2026-01-01") en zonas UTC-negativas daría 31 de diciembre.
      const fecha = parseDateLocal('2026-01-01');
      expect(fecha.getDate()).toBe(1);
      expect(fecha.getMonth()).toBe(0);
    });

    it('resuelve datetimes ISO al día calendario de Puerto Rico', () => {
      // 03:00 UTC = 23:00 del día anterior en America/Puerto_Rico (UTC-4).
      const fecha = parseDateLocal('2026-07-14T03:00:00.000Z');
      expect(fecha.getFullYear()).toBe(2026);
      expect(fecha.getMonth()).toBe(6);
      expect(fecha.getDate()).toBe(13);
    });

    it('mantiene el día PR para datetimes ISO dentro del mismo día', () => {
      // 18:00 UTC = 14:00 en PR — mismo día calendario.
      const fecha = parseDateLocal('2026-07-14T18:00:00.000Z');
      expect(fecha.getDate()).toBe(14);
    });
  });
});
