/**
 * Componente para mostrar una foto histórica
 * Sprint 0 - Estructura base
 */

import { FotoHistorica } from '@/lib/types/revista';

interface FotoHistoricaCardProps {
  foto: FotoHistorica;
  className?: string;
}

export function FotoHistoricaCard({ foto, className = '' }: FotoHistoricaCardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition ${className}`}>
      {/* Imagen */}
      <div className="relative h-64 bg-gray-200">
        {/* TODO Sprint 1+: Agregar Image component */}
        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
          📷 Foto Histórica
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-pr-blue mb-2">
          {foto.titulo}
        </h3>

        {foto.descripcion && (
          <p className="text-sm text-gray-600 mb-3">
            {foto.descripcion}
          </p>
        )}

        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{foto.año || 'Año desconocido'}</span>
          <span className="capitalize">{foto.categoria}</span>
        </div>

        {foto.deporteRelacionado && (
          <div className="mt-2">
            <span className="inline-block bg-pr-blue/10 text-pr-blue px-2 py-1 rounded text-xs font-semibold">
              {foto.deporteRelacionado}
            </span>
          </div>
        )}

        {/* Link a revista */}
        <div className="mt-3 pt-3 border-t border-gray-200">
          <a
            href={`/revistas/${foto.revistaOrigen}#page-${foto.paginaOrigen}`}
            className="text-xs text-pr-blue hover:underline"
          >
            Revista #{foto.revistaOrigen}, pág {foto.paginaOrigen}
          </a>
        </div>
      </div>
    </div>
  );
}
