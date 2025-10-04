/**
 * Componente para mostrar la sección de biografía de un exaltado
 * Sprint 0 - Estructura base
 */

interface BiografiaSectionProps {
  biografia: string;
  revistaNumero: number;
  paginaInicio: number;
  paginaFin: number;
  className?: string;
}

export function BiografiaSection({
  biografia,
  revistaNumero,
  paginaInicio,
  paginaFin,
  className = ''
}: BiografiaSectionProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <h2 className="text-2xl font-bold text-pr-blue mb-4 border-b border-gray-200 pb-2">
        Biografía
      </h2>

      <div className="prose max-w-none text-gray-700 leading-relaxed">
        {biografia ? (
          <p className="whitespace-pre-line">{biografia}</p>
        ) : (
          <p className="text-gray-500 italic">Biografía próximamente disponible</p>
        )}
      </div>

      {/* Link a revista original */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <a
          href={`/revistas/${revistaNumero}#page-${paginaInicio}`}
          className="inline-flex items-center gap-2 text-pr-blue hover:text-pr-dark-blue hover:underline transition"
        >
          <span className="text-xl">📖</span>
          <div>
            <div className="font-semibold">Ver en Revista Original</div>
            <div className="text-sm text-gray-500">
              Revista #{revistaNumero}, página{paginaInicio === paginaFin ? '' : 's'}{' '}
              {paginaInicio}{paginaInicio !== paginaFin && `-${paginaFin}`}
            </div>
          </div>
        </a>
      </div>
    </div>
  );
}
