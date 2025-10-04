/**
 * Componente de galería de fotos históricas
 * Sprint 0 - Estructura base
 */

'use client';

import { FotoHistorica } from '@/lib/types/revista';
import { FotoHistoricaCard } from './FotoHistoricaCard';

interface GaleriaHistoricaProps {
  fotos: FotoHistorica[];
  titulo?: string;
  className?: string;
}

export function GaleriaHistorica({
  fotos,
  titulo = 'Galería Histórica',
  className = ''
}: GaleriaHistoricaProps) {
  if (fotos.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-gray-500">No hay fotos disponibles</p>
        <p className="text-sm text-gray-400 mt-2">
          Las fotos se agregarán en los próximos sprints
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      <h2 className="text-3xl font-bold text-pr-blue mb-6">{titulo}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fotos.map((foto) => (
          <FotoHistoricaCard key={foto.id} foto={foto} />
        ))}
      </div>
    </div>
  );
}
