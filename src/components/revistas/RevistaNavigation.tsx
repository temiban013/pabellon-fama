/**
 * Componente de navegación entre revistas
 * Sprint 0 - Estructura base
 */

import { RevistaMetadata } from '@/lib/types/revista';

interface RevistaNavigationProps {
  currentRevista: RevistaMetadata;
  allRevistas: RevistaMetadata[];
  className?: string;
}

export function RevistaNavigation({ currentRevista, allRevistas, className = '' }: RevistaNavigationProps) {
  const currentIndex = allRevistas.findIndex(r => r.numero === currentRevista.numero);
  const previousRevista = currentIndex > 0 ? allRevistas[currentIndex - 1] : null;
  const nextRevista = currentIndex < allRevistas.length - 1 ? allRevistas[currentIndex + 1] : null;

  return (
    <div className={`flex items-center justify-between ${className}`}>
      {/* Revista anterior */}
      <div className="flex-1">
        {previousRevista && (
          <a
            href={`/revistas/${previousRevista.numero}`}
            className="flex items-center gap-2 text-pr-blue hover:text-pr-dark-blue"
          >
            <span>←</span>
            <div>
              <div className="text-sm text-gray-500">Anterior</div>
              <div className="font-semibold">Revista #{previousRevista.numero}</div>
            </div>
          </a>
        )}
      </div>

      {/* Revista actual */}
      <div className="text-center px-4">
        <div className="text-sm text-gray-500">Estás viendo</div>
        <div className="text-xl font-bold text-pr-blue">
          Revista #{currentRevista.numero} ({currentRevista.year})
        </div>
      </div>

      {/* Revista siguiente */}
      <div className="flex-1 flex justify-end">
        {nextRevista && (
          <a
            href={`/revistas/${nextRevista.numero}`}
            className="flex items-center gap-2 text-pr-blue hover:text-pr-dark-blue"
          >
            <div className="text-right">
              <div className="text-sm text-gray-500">Siguiente</div>
              <div className="font-semibold">Revista #{nextRevista.numero}</div>
            </div>
            <span>→</span>
          </a>
        )}
      </div>
    </div>
  );
}
