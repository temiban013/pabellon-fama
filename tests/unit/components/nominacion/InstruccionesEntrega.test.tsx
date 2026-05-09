import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

vi.mock('@/lib/data/nominacion-2026', () => ({
  NOMINACION_2026: {
    exaltacionNumero: 9,
    exaltacionOrdinal: 'Novena',
    ceremonia: { fecha: new Date('2026-11-08T15:00:00-04:00'), lugar: null },
    periodo: { apertura: new Date('2026-05-15'), cierre: new Date('2026-08-31') },
    categorias: ['Atleta', 'Propulsor', 'Cronista deportivo'],
    puntosDistribucion: [
      { nombre: 'Walo Radio', tipo: 'Emisora' },
      { nombre: 'Periódico El Oriental', tipo: 'Periódico' },
      { nombre: 'Radio Victoria', tipo: 'Emisora' },
      { nombre: 'Centro Cultural Antonia Sáez', tipo: 'Sede principal' },
    ],
    contacto: {
      telefonoPrincipal: '787-410-1237',
      telefonosAdicionales: ['787-209-8250', '787-559-4013', '787-438-0585'],
      email: 'informa@pfdh.org',
      web: 'https://pfdh.org',
    },
    documentos: {
      boleta: { url: '/test.pdf', downloadFileName: 'test.pdf' },
      comunicado: { url: '/test.pdf', downloadFileName: 'test.pdf' },
    },
  },
}));

afterEach(() => {
  cleanup();
});

describe('InstruccionesEntrega', () => {
  describe('Test 1: lugar === null hides sede block', () => {
    it('no renderiza "Sede de la ceremonia" cuando lugar es null', async () => {
      const { InstruccionesEntrega } = await import(
        '@/components/nominacion/InstruccionesEntrega'
      );
      render(<InstruccionesEntrega />);
      expect(screen.queryByText('Sede de la ceremonia')).toBeNull();
    });
  });

  describe('Test 2: lugar string shows sede block', () => {
    beforeEach(() => {
      vi.resetModules();
    });

    it('renderiza "Sede de la ceremonia" cuando lugar tiene valor', async () => {
      vi.doMock('@/lib/data/nominacion-2026', () => ({
        NOMINACION_2026: {
          exaltacionNumero: 9,
          exaltacionOrdinal: 'Novena',
          ceremonia: {
            fecha: new Date('2026-11-08T15:00:00-04:00'),
            lugar: 'Coliseo Roger Mendoza, Humacao',
          },
          periodo: {
            apertura: new Date('2026-05-15'),
            cierre: new Date('2026-08-31'),
          },
          categorias: ['Atleta', 'Propulsor', 'Cronista deportivo'],
          puntosDistribucion: [
            { nombre: 'Walo Radio', tipo: 'Emisora' },
            { nombre: 'Periódico El Oriental', tipo: 'Periódico' },
            { nombre: 'Radio Victoria', tipo: 'Emisora' },
            { nombre: 'Centro Cultural Antonia Sáez', tipo: 'Sede principal' },
          ],
          contacto: {
            telefonoPrincipal: '787-410-1237',
            telefonosAdicionales: [
              '787-209-8250',
              '787-559-4013',
              '787-438-0585',
            ],
            email: 'informa@pfdh.org',
            web: 'https://pfdh.org',
          },
          documentos: {
            boleta: { url: '/test.pdf', downloadFileName: 'test.pdf' },
            comunicado: { url: '/test.pdf', downloadFileName: 'test.pdf' },
          },
        },
      }));

      const { InstruccionesEntrega } = await import(
        '@/components/nominacion/InstruccionesEntrega'
      );
      render(<InstruccionesEntrega />);

      expect(screen.getByText('Sede de la ceremonia')).toBeInTheDocument();
      expect(
        screen.getByText('Coliseo Roger Mendoza, Humacao')
      ).toBeInTheDocument();
    });
  });

  describe('Test 3: all 4 puntos de distribución render', () => {
    it('renderiza los 4 puntos de distribución con su tipo como badge', async () => {
      const { InstruccionesEntrega } = await import(
        '@/components/nominacion/InstruccionesEntrega'
      );
      render(<InstruccionesEntrega />);

      // Nombres
      expect(screen.getByText('Walo Radio')).toBeInTheDocument();
      expect(screen.getByText('Periódico El Oriental')).toBeInTheDocument();
      expect(screen.getByText('Radio Victoria')).toBeInTheDocument();
      expect(screen.getByText('Centro Cultural Antonia Sáez')).toBeInTheDocument();

      // Tipos (badges)
      const emisoraBadges = screen.getAllByText('Emisora');
      expect(emisoraBadges).toHaveLength(2);
      expect(screen.getByText('Periódico')).toBeInTheDocument();
      expect(screen.getByText('Sede principal')).toBeInTheDocument();
    });
  });

  describe('Test 4: principal phone is a tel: link with hyphens stripped', () => {
    it('el teléfono principal es un enlace tel: sin guiones', async () => {
      const { InstruccionesEntrega } = await import(
        '@/components/nominacion/InstruccionesEntrega'
      );
      render(<InstruccionesEntrega />);

      const link = screen.getByRole('link', { name: '787-410-1237' });
      expect(link).toHaveAttribute('href', 'tel:7874101237');
    });
  });

  describe('Test 5: email is a mailto: link', () => {
    it('el email es un enlace mailto:', async () => {
      const { InstruccionesEntrega } = await import(
        '@/components/nominacion/InstruccionesEntrega'
      );
      render(<InstruccionesEntrega />);

      const link = screen.getByRole('link', { name: 'informa@pfdh.org' });
      expect(link).toHaveAttribute('href', 'mailto:informa@pfdh.org');
    });
  });
});
