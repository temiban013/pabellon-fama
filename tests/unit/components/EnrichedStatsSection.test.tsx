import { describe, it, expect } from 'vitest';
import { render, screen } from '../../setup/test-utils';
import { EnrichedStatsSection } from '@/components/directorio/EnrichedStatsSection';

describe('EnrichedStatsSection', () => {
  it('returns null when no data is provided', () => {
    const { container } = render(<EnrichedStatsSection />);
    expect(container.innerHTML).toBe('');
  });

  it('returns null when undefined is passed', () => {
    const { container } = render(<EnrichedStatsSection estadisticasDeportivas={undefined} />);
    expect(container.innerHTML).toBe('');
  });

  it('renders beisbol stats correctly', () => {
    const stats = {
      tipo: 'beisbol' as const,
      datos: {
        posiciones: ['Jardinero Central'],
        equipos: [{ nombre: 'Criollos de Humacao', anos: '1975-1985' }],
        bateo: {
          promedio: '.325',
          jonrones: 45,
        },
        anosActivos: '1975-1992',
      },
    };

    render(<EnrichedStatsSection estadisticasDeportivas={stats} />);
    expect(screen.getByText(/Béisbol/i)).toBeInTheDocument();
    expect(screen.getByText('.325')).toBeInTheDocument();
    expect(screen.getByText('45')).toBeInTheDocument();
    expect(screen.getByText(/Criollos de Humacao/)).toBeInTheDocument();
  });

  it('renders boxeo stats correctly', () => {
    const stats = {
      tipo: 'boxeo' as const,
      datos: {
        categoriasPeso: ['Welterweight'],
        record: '25-3-1',
        nocauts: 18,
        titulosGanados: ['Campeón Nacional'],
      },
    };

    render(<EnrichedStatsSection estadisticasDeportivas={stats} />);
    expect(screen.getByText(/Boxeo/i)).toBeInTheDocument();
    expect(screen.getByText('25-3-1')).toBeInTheDocument();
    expect(screen.getByText('18')).toBeInTheDocument();
  });
});
