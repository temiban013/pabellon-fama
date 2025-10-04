/**
 * Componente Card para mostrar una revista en el grid
 * Sprint 0 - Estructura base
 */

import { RevistaMetadata } from '@/lib/types/revista';

interface RevistaCardProps {
  revista: RevistaMetadata;
  className?: string;
}

export function RevistaCard({ revista, className = '' }: RevistaCardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md border border-pr-blue/20 overflow-hidden hover:shadow-lg transition-shadow duration-200 ${className}`}>
      {/* Portada */}
      <div className="relative h-64 bg-gray-200">
        {/* TODO Sprint 1+: Agregar Image component */}
        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
          Portada Revista #{revista.numero}
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4">
        <h3 className="text-xl font-bold text-pr-blue mb-2">
          Revista #{revista.numero} - {revista.year}
        </h3>

        <p className="text-sm text-gray-600 mb-3">
          {revista.descripcion}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span>{revista.exaltadosCount} exaltados</span>
          <span>{revista.totalPaginas} páginas</span>
        </div>

        {/* Botones */}
        <div className="flex gap-2">
          <button className="flex-1 bg-pr-blue text-white px-4 py-2 rounded hover:bg-pr-dark-blue transition">
            Ver Revista
          </button>
          <button className="px-4 py-2 border border-pr-blue text-pr-blue rounded hover:bg-pr-blue/10 transition">
            Descargar
          </button>
        </div>
      </div>
    </div>
  );
}
