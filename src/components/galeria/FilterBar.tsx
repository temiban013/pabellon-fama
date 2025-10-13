"use client";

import { Camera, Calendar, Trophy, RotateCcw } from "lucide-react";

interface FilterBarProps {
  selectedRevista: number | null;
  selectedDecada: number | null;
  selectedDeporte: string | null;
  revistas: number[];
  decadas: number[];
  deportes: string[];
  onRevistaChange: (revista: number | null) => void;
  onDecadaChange: (decada: number | null) => void;
  onDeporteChange: (deporte: string | null) => void;
  onReset: () => void;
  totalFotos: number;
  filteredCount: number;
}

export function FilterBar({
  selectedRevista,
  selectedDecada,
  selectedDeporte,
  revistas,
  decadas,
  deportes,
  onRevistaChange,
  onDecadaChange,
  onDeporteChange,
  onReset,
  totalFotos,
  filteredCount,
}: FilterBarProps) {
  const hasActiveFilters = selectedRevista !== null || selectedDecada !== null || selectedDeporte !== null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Camera className="h-5 w-5 text-pabellon-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filtrar Fotografías</h3>
        </div>

        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 text-sm text-pabellon-green-600 hover:text-pabellon-green-700 font-medium transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            Limpiar Filtros
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Revista Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Trophy className="h-4 w-4 inline mr-1" />
            Por Revista
          </label>
          <select
            value={selectedRevista || ""}
            onChange={(e) => onRevistaChange(e.target.value ? parseInt(e.target.value) : null)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pabellon-green-500 focus:border-transparent transition-all"
          >
            <option value="">Todas las revistas</option>
            {revistas.map((revista) => (
              <option
                key={revista}
                value={revista}
              >
                Revista #{revista}
              </option>
            ))}
          </select>
        </div>

        {/* Década Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="h-4 w-4 inline mr-1" />
            Por Década
          </label>
          <select
            value={selectedDecada || ""}
            onChange={(e) => onDecadaChange(e.target.value ? parseInt(e.target.value) : null)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pabellon-green-500 focus:border-transparent transition-all"
          >
            <option value="">Todas las décadas</option>
            {decadas.map((decada) => (
              <option key={decada} value={decada}>
                {decada}s
              </option>
            ))}
          </select>
        </div>

        {/* Deporte Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Trophy className="h-4 w-4 inline mr-1" />
            Por Deporte
          </label>
          <select
            value={selectedDeporte || ""}
            onChange={(e) => onDeporteChange(e.target.value || null)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pabellon-green-500 focus:border-transparent transition-all"
          >
            <option value="">Todos los deportes</option>
            {deportes.map((deporte) => (
              <option key={deporte} value={deporte}>
                {deporte}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600 text-center pt-4 border-t border-gray-200">
        Mostrando <span className="font-semibold text-pabellon-green-700">{filteredCount}</span> de{" "}
        <span className="font-semibold">{totalFotos}</span> fotografías históricas
      </div>
    </div>
  );
}
