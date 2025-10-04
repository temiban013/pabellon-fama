/**
 * Componente de timeline de ceremonias de exaltación
 * Sprint 0 - Estructura base
 */

'use client';

import { CeremoniaMetadata } from '@/lib/types/revista';

interface TimelineProps {
  ceremonias: CeremoniaMetadata[];
  className?: string;
}

export function Timeline({ ceremonias, className = '' }: TimelineProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Línea vertical */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-pr-blue/30" />

      {/* Items */}
      <div className="space-y-8">
        {ceremonias.map((ceremonia) => (
          <div key={ceremonia.exaltacionNumero} className="relative pl-20">
            {/* Punto en timeline */}
            <div className="absolute left-6 top-2 w-5 h-5 rounded-full bg-pr-blue border-4 border-white shadow" />

            {/* Contenido */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-xl font-bold text-pr-blue">
                    {ceremonia.exaltacionNumero}ª Exaltación
                  </h3>
                  <p className="text-gray-600">
                    {new Date(ceremonia.fecha).toLocaleDateString('es-PR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                <a
                  href={`/revistas/${ceremonia.exaltacionNumero}`}
                  className="text-pr-blue hover:text-pr-dark-blue text-sm underline"
                >
                  Ver Revista →
                </a>
              </div>

              {ceremonia.lugar && (
                <p className="text-gray-700 mb-2">
                  📍 {ceremonia.lugar}
                </p>
              )}

              {ceremonia.maestroCeremonia && (
                <p className="text-gray-700">
                  🎤 Maestro de Ceremonia: {ceremonia.maestroCeremonia}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
