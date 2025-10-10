"use client";

import { useState } from "react";
import {
  FunnelIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import { type FiltrosDirectorio, type CategoriaExaltado } from "@/lib/types";
import { capitalize } from "@/lib/utils";

// Mapeo para mostrar nombres más descriptivos de categorías
const categoriasLabels: Record<string, string> = {
  atleta: "Atleta",
  jugador: "Jugador",
  boxeador: "Boxeador", 
  propulsor: "Propulsor",
  cronista: "Cronista Deportivo",
  equipo: "Equipo",
  promotor: "Promotor",
  dirigente: "Dirigente",
  entrenador: "Entrenador",
  arbitro: "Árbitro",
  comentarista: "Comentarista",
  benefactor: "Benefactor",
  "atleta-propulsor": "Atleta-Propulsor",
  "jugador-propulsor": "Jugador-Propulsor",
};

type SortOption = "nombre" | "ano" | "deporte";
type SortDirection = "asc" | "desc";

interface FilterPanelProps {
  filters: FiltrosDirectorio;
  onFiltersChange: (filters: FiltrosDirectorio) => void;
  sortBy: SortOption;
  sortDirection: SortDirection;
  onSortChange: (field: SortOption, direction: SortDirection) => void;
  availableDeportes: string[];
  availableCategorias: string[];
  availableAnos: number[];
  className?: string;
}

interface FilterSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function FilterSection({
  title,
  isOpen,
  onToggle,
  children,
}: FilterSectionProps) {
  return (
    <div className="border border-gray-200 rounded-lg">
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between text-left font-medium text-gray-900 hover:bg-gray-50 transition-colors"
      >
        {title}
        {isOpen ? (
          <ChevronUpIcon className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDownIcon className="w-5 h-5 text-gray-500" />
        )}
      </button>
      {isOpen && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

export function FilterPanel({
  filters,
  onFiltersChange,
  sortBy,
  sortDirection,
  onSortChange,
  availableDeportes,
  availableCategorias,
  availableAnos,
  className = "",
}: FilterPanelProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    deportes: true,
    categorias: false,
    genero: false,
    anos: false,
    ordenamiento: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleDeporteChange = (deporte: string, checked: boolean) => {
    const currentDeportes = filters.deporte || [];
    const newDeportes = checked
      ? [...currentDeportes, deporte]
      : currentDeportes.filter((d) => d !== deporte);

    onFiltersChange({
      ...filters,
      deporte: newDeportes.length > 0 ? newDeportes : undefined,
    });
  };

  const handleCategoriaChange = (categoria: string, checked: boolean) => {
    const currentCategorias = filters.categoria || [];
    const newCategorias = checked
      ? [...currentCategorias, categoria as CategoriaExaltado]
      : currentCategorias.filter((c) => c !== categoria);

    onFiltersChange({
      ...filters,
      categoria: newCategorias.length > 0 ? newCategorias : undefined,
    });
  };

  const handleGeneroChange = (genero: "masculino" | "femenino" | "equipo", checked: boolean) => {
    const currentGeneros = filters.genero || [];
    const newGeneros = checked
      ? [...currentGeneros, genero]
      : currentGeneros.filter((g) => g !== genero);

    onFiltersChange({
      ...filters,
      genero: newGeneros.length > 0 ? newGeneros : undefined,
    });
  };

  const handleAnoDesdeChange = (ano: string) => {
    const anoNum = ano ? parseInt(ano) : undefined;
    onFiltersChange({
      ...filters,
      anoDesde: anoNum,
    });
  };

  const handleAnoHastaChange = (ano: string) => {
    const anoNum = ano ? parseInt(ano) : undefined;
    onFiltersChange({
      ...filters,
      anoHasta: anoNum,
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  const getSortLabel = (field: SortOption) => {
    const labels = {
      nombre: "Nombre",
      ano: "Año de exaltación",
      deporte: "Deporte",
    };
    return labels[field];
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-lg border border-gray-200 p-6 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-pabellon-green-800 flex items-center gap-2">
          <FunnelIcon className="w-5 h-5" />
          Filtros
        </h3>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-pabellon-gold-600 hover:text-pabellon-gold-700 font-medium transition-colors"
          >
            Limpiar todo
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Deportes */}
        <FilterSection
          title="Deportes"
          isOpen={openSections.deportes}
          onToggle={() => toggleSection("deportes")}
        >
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {availableDeportes.map((deporte) => (
              <label key={deporte} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.deporte?.includes(deporte) || false}
                  onChange={(e) =>
                    handleDeporteChange(deporte, e.target.checked)
                  }
                  className="rounded border-gray-300 text-pabellon-gold-600 focus:ring-pabellon-gold-500"
                />
                <span className="ml-2 text-sm text-gray-700">{deporte}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Categorías */}
        <FilterSection
          title="Categorías"
          isOpen={openSections.categorias}
          onToggle={() => toggleSection("categorias")}
        >
          <div className="space-y-2">
            {availableCategorias.map((categoria) => (
              <label key={categoria} className="flex items-center">
                <input
                  type="checkbox"
                  checked={
                    filters.categoria?.includes(
                      categoria as CategoriaExaltado
                    ) || false
                  }
                  onChange={(e) =>
                    handleCategoriaChange(categoria, e.target.checked)
                  }
                  className="rounded border-gray-300 text-pabellon-gold-600 focus:ring-pabellon-gold-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {categoriasLabels[categoria] || capitalize(categoria)}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Género */}
        <FilterSection
          title="Género"
          isOpen={openSections.genero}
          onToggle={() => toggleSection("genero")}
        >
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.genero?.includes("masculino") || false}
                onChange={(e) => handleGeneroChange("masculino", e.target.checked)}
                className="rounded border-gray-300 text-pabellon-gold-600 focus:ring-pabellon-gold-500"
              />
              <span className="ml-2 text-sm text-gray-700">Masculino</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.genero?.includes("femenino") || false}
                onChange={(e) => handleGeneroChange("femenino", e.target.checked)}
                className="rounded border-gray-300 text-pabellon-gold-600 focus:ring-pabellon-gold-500"
              />
              <span className="ml-2 text-gray-700">Femenino</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.genero?.includes("equipo") || false}
                onChange={(e) => handleGeneroChange("equipo", e.target.checked)}
                className="rounded border-gray-300 text-pabellon-gold-600 focus:ring-pabellon-gold-500"
              />
              <span className="ml-2 text-sm text-gray-700">Equipos</span>
            </label>
          </div>
        </FilterSection>

        {/* Rango de años */}
        <FilterSection
          title="Año de exaltación"
          isOpen={openSections.anos}
          onToggle={() => toggleSection("anos")}
        >
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Desde
              </label>
              <select
                value={filters.anoDesde || ""}
                onChange={(e) => handleAnoDesdeChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pabellon-gold-500 focus:border-pabellon-gold-500"
              >
                <option value="">Cualquier año</option>
                {availableAnos.map((ano) => (
                  <option key={ano} value={ano}>
                    {ano}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hasta
              </label>
              <select
                value={filters.anoHasta || ""}
                onChange={(e) => handleAnoHastaChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pabellon-gold-500 focus:border-pabellon-gold-500"
              >
                <option value="">Cualquier año</option>
                {availableAnos.map((ano) => (
                  <option key={ano} value={ano}>
                    {ano}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </FilterSection>

        {/* Ordenamiento */}
        <FilterSection
          title="Ordenar por"
          isOpen={openSections.ordenamiento}
          onToggle={() => toggleSection("ordenamiento")}
        >
          <div className="space-y-3">
            {/* Campo de ordenamiento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Campo
              </label>
              <select
                value={sortBy}
                onChange={(e) =>
                  onSortChange(e.target.value as SortOption, sortDirection)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pabellon-gold-500 focus:border-pabellon-gold-500"
              >
                <option value="nombre">Nombre</option>
                <option value="ano">Año de exaltación</option>
                <option value="deporte">Deporte</option>
              </select>
            </div>

            {/* Dirección */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dirección
              </label>
              <div className="flex space-x-2">
                <button
                  onClick={() => onSortChange(sortBy, "asc")}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded-md border transition-colors ${
                    sortDirection === "asc"
                      ? "bg-pabellon-gold-600 text-white border-pabellon-gold-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  A-Z ↑
                </button>
                <button
                  onClick={() => onSortChange(sortBy, "desc")}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded-md border transition-colors ${
                    sortDirection === "desc"
                      ? "bg-pabellon-gold-600 text-white border-pabellon-gold-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  Z-A ↓
                </button>
              </div>
            </div>
          </div>
        </FilterSection>
      </div>

      {/* Resumen de filtros activos */}
      {hasActiveFilters && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Filtros activos:
          </h4>
          <div className="space-y-1 text-xs">
            {filters.deporte?.length && (
              <div className="text-gray-600">
                <span className="font-medium">Deportes:</span>{" "}
                {filters.deporte.join(", ")}
              </div>
            )}
            {filters.categoria?.length && (
              <div className="text-gray-600">
                <span className="font-medium">Categorías:</span>{" "}
                {filters.categoria.map(cat => categoriasLabels[cat] || capitalize(cat)).join(", ")}
              </div>
            )}
            {filters.genero?.length && (
              <div className="text-gray-600">
                <span className="font-medium">Género:</span>{" "}
                {filters.genero.map(g => capitalize(g)).join(", ")}
              </div>
            )}
            {(filters.anoDesde || filters.anoHasta) && (
              <div className="text-gray-600">
                <span className="font-medium">Años:</span>{" "}
                {filters.anoDesde || "Inicio"} - {filters.anoHasta || "Actual"}
              </div>
            )}
            <div className="text-gray-600">
              <span className="font-medium">Orden:</span> {getSortLabel(sortBy)}{" "}
              ({sortDirection === "asc" ? "A-Z" : "Z-A"})
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
