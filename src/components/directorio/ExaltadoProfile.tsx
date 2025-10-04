/**
 * Componente de perfil completo de exaltado
 * Sprint 0 - Estructura base
 */

import { ExaltadoRevista } from '@/lib/types/revista';

interface ExaltadoProfileProps {
  exaltado: ExaltadoRevista;
}

export function ExaltadoProfile({ exaltado }: ExaltadoProfileProps) {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-pr-blue to-pr-dark-blue text-white rounded-lg p-8 mb-6">
        <div className="flex items-start gap-6">
          {/* Foto placeholder */}
          <div className="w-32 h-32 bg-white/20 rounded-lg flex-shrink-0" />

          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">
              {exaltado.nombre} {exaltado.apodo && `"${exaltado.apodo}"`} {exaltado.apellidos}
            </h1>

            <div className="flex items-center gap-4 text-lg">
              <span className="bg-white/20 px-3 py-1 rounded">
                {exaltado.categoria}
              </span>
              <span>Exaltado en {exaltado.anoExaltacion}</span>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {exaltado.deportes.map((deporte) => (
                <span key={deporte} className="bg-pr-gold text-pr-dark-blue px-3 py-1 rounded text-sm font-semibold">
                  {deporte}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Biografía */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-pr-blue mb-4">Biografía</h2>
        <div className="prose max-w-none text-gray-700">
          {exaltado.contenido.biografia || 'Biografía próximamente disponible'}
        </div>

        {/* Link a revista */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <a
            href={`/revistas/${exaltado.revistaNumero}#page-${exaltado.paginaInicio}`}
            className="text-pr-blue hover:text-pr-dark-blue inline-flex items-center gap-2"
          >
            📖 Ver en Revista Original #{exaltado.revistaNumero}
            <span className="text-sm text-gray-500">
              (páginas {exaltado.paginaInicio}-{exaltado.paginaFin})
            </span>
          </a>
        </div>
      </div>

      {/* Logros */}
      {exaltado.contenido.logros && exaltado.contenido.logros.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-pr-blue mb-4">Logros Principales</h2>
          <ul className="space-y-2">
            {exaltado.contenido.logros.map((logro, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-pr-gold text-xl">🏆</span>
                <span className="text-gray-700">{logro}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Estadísticas */}
      {exaltado.contenido.estadisticas && Object.keys(exaltado.contenido.estadisticas).length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-pr-blue mb-4">Estadísticas</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(exaltado.contenido.estadisticas).map(([key, value]) => (
              <div key={key} className="border border-gray-200 rounded p-3">
                <div className="text-sm text-gray-500 capitalize">{key.replace(/_/g, ' ')}</div>
                <div className="text-xl font-bold text-pr-blue">{value}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
