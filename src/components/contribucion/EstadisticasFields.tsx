// components/contribucion/EstadisticasFields.tsx
"use client";

import type { EstadisticaContribuida } from "@/lib/types/contribucion";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";

interface EstadisticasFieldsProps {
  estadisticas: EstadisticaContribuida[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (
    index: number,
    field: keyof EstadisticaContribuida,
    value: string
  ) => void;
}

export default function EstadisticasFields({
  estadisticas,
  onAdd,
  onRemove,
  onUpdate,
}: EstadisticasFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-700">
          Estadísticas Deportivas
        </h4>
        {estadisticas.length < 20 && (
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center gap-1 text-sm text-pabellon-green-700 hover:text-pabellon-green-900 font-medium transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            Agregar estadística
          </button>
        )}
      </div>

      {estadisticas.length === 0 && (
        <p className="text-sm text-gray-500 italic">
          Haga clic en &quot;Agregar estadística&quot; para añadir datos
          específicos.
        </p>
      )}

      {estadisticas.map((stat, index) => (
        <div
          key={index}
          className="border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">
              Estadística #{index + 1}
            </span>
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="text-red-400 hover:text-red-600 transition-colors"
              aria-label={`Eliminar estadística ${index + 1}`}
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-600">
                Categoría <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={stat.categoria}
                onChange={(e) => onUpdate(index, "categoria", e.target.value)}
                placeholder="Ej: Bateo, Pitcheo, Puntos"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-pabellon-gold-500 focus:border-transparent outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-600">
                Dato <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={stat.dato}
                onChange={(e) => onUpdate(index, "dato", e.target.value)}
                placeholder="Ej: Promedio de bateo"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-pabellon-gold-500 focus:border-transparent outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-600">
                Valor <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={stat.valor}
                onChange={(e) => onUpdate(index, "valor", e.target.value)}
                placeholder="Ej: .325"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-pabellon-gold-500 focus:border-transparent outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-600">
                Temporada/Año
              </label>
              <input
                type="text"
                value={stat.temporadaOAno ?? ""}
                onChange={(e) =>
                  onUpdate(index, "temporadaOAno", e.target.value)
                }
                placeholder="Ej: 1985 o 1983-1990"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-pabellon-gold-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-600">
              Equipo
            </label>
            <input
              type="text"
              value={stat.equipo ?? ""}
              onChange={(e) => onUpdate(index, "equipo", e.target.value)}
              placeholder="Ej: Criollos de Humacao"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-pabellon-gold-500 focus:border-transparent outline-none"
            />
          </div>
        </div>
      ))}

      {estadisticas.length >= 20 && (
        <p className="text-xs text-amber-600">
          Máximo de 20 estadísticas alcanzado.
        </p>
      )}
    </div>
  );
}
