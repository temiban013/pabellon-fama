/**
 * Componente para visualizar PDF de revista
 * Sprint 0 - Estructura base
 * TODO Sprint 1+: Implementar con react-pdf
 */

'use client';

interface RevistaViewerProps {
  pdfUrl: string;
  revistaNumero: number;
  totalPaginas: number;
}

export function RevistaViewer({ pdfUrl, revistaNumero, totalPaginas }: RevistaViewerProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-pr-blue">
          Revista #{revistaNumero}
        </h2>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            Página 1 de {totalPaginas}
          </span>

          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
              Anterior
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
              Siguiente
            </button>
          </div>
        </div>
      </div>

      {/* Viewer Placeholder */}
      <div className="border border-gray-300 rounded-lg p-8 bg-gray-50 min-h-[600px] flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p className="text-lg mb-2">PDF Viewer</p>
          <p className="text-sm">TODO: Implementar en Sprint 1+</p>
          <p className="text-sm mt-4">
            <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="text-pr-blue underline">
              Abrir PDF en nueva pestaña
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
