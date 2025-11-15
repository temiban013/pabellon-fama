/**
 * SearchFilters.tsx
 *
 * Componente de búsqueda y filtros avanzados para el directorio de exaltados.
 * Incluye:
 * - Búsqueda de texto con debounce
 * - Filtro múltiple de deportes (multi-select)
 * - Filtro por década de exaltación
 * - Filtro por categoría (pills/badges)
 * - Filtro por estado (activos/fallecidos)
 *
 * Mobile-first responsive con colores del Pabellón
 */

"use client";

import {
  MagnifyingGlassIcon,
  XMarkIcon,
  FunnelIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import {
  type CategoriaExaltado,
  type DecadaExaltacion,
  type EstadoExaltado,
  type AthleteFilters,
} from "@/hooks/useAthleteFilter";

// ============================================
// TIPOS
// ============================================

interface SearchFiltersProps {
  // Estado actual de filtros
  filters: AthleteFilters;

  // Callbacks para actualizar filtros
  onSearchTextChange: (text: string) => void;
  onDeportesChange: (deportes: string[]) => void;
  onDecadaChange: (decada: DecadaExaltacion) => void;
  onCategoriasChange: (categorias: CategoriaExaltado[]) => void;
  onEstadoChange: (estado: EstadoExaltado) => void;
  onClearAll: () => void;

  // Datos para los controles
  availableDeportes: string[];
  availableCategorias: CategoriaExaltado[];

  // Información de resultados
  totalResults: number;
  totalAthletes: number;

  // Opcional
  className?: string;
}

// ============================================
// CONSTANTES
// ============================================

const DECADAS: { value: DecadaExaltacion; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "1980s", label: "1980s" },
  { value: "1990s", label: "1990s" },
  { value: "2000s", label: "2000s" },
  { value: "2010s", label: "2010s" },
  { value: "2020s", label: "2020s" },
];

// Mapeo de categorías a etiquetas legibles
const CATEGORIA_LABELS: Record<CategoriaExaltado, string> = {
  "atleta": "Deportista",
  "jugador": "Jugador",
  "boxeador": "Boxeador",
  "propulsor": "Propulsor",
  "entrenador": "Entrenador",
  "dirigente": "Dirigente",
  "promotor": "Promotor",
  "cronista": "Cronista",
  "arbitro": "Árbitro",
  "comentarista": "Comentarista",
  "benefactor": "Benefactor",
  "equipo": "Equipo",
  "atleta-propulsor": "Atleta-Propulsor",
  "jugador-propulsor": "Jugador-Propulsor",
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export function SearchFilters({
  filters,
  onSearchTextChange,
  onDeportesChange,
  onDecadaChange,
  onCategoriasChange,
  onEstadoChange,
  onClearAll,
  availableDeportes,
  availableCategorias,
  totalResults,
  totalAthletes,
  className = "",
}: SearchFiltersProps) {
  // ============================================
  // HANDLERS
  // ============================================

  const handleDeporteToggle = (deporte: string) => {
    const newDeportes = filters.deportes.includes(deporte)
      ? filters.deportes.filter(d => d !== deporte)
      : [...filters.deportes, deporte];
    onDeportesChange(newDeportes);
  };

  const handleCategoriaToggle = (categoria: CategoriaExaltado) => {
    const newCategorias = filters.categorias.includes(categoria)
      ? filters.categorias.filter(c => c !== categoria)
      : [...filters.categorias, categoria];
    onCategoriasChange(newCategorias);
  };

  const hasActiveFilters =
    filters.searchText.trim() !== "" ||
    filters.deportes.length > 0 ||
    filters.decada !== "todos" ||
    filters.categorias.length > 0 ||
    filters.estado !== "todos";

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className={`bg-white rounded-lg shadow-lg border-2 border-pabellon-brown ${className}`}>
      {/* Header */}
      <div className="px-4 py-4 sm:px-6 border-b-2 border-pabellon-brown">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-pabellon-green-800 flex items-center gap-2">
            <FunnelIcon className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
            <span>Búsqueda Avanzada</span>
          </h2>
          {hasActiveFilters && (
            <button
              onClick={onClearAll}
              className="text-sm font-medium text-pabellon-gold-600 hover:text-pabellon-gold-700 transition-colors focus:outline-none focus:ring-2 focus:ring-pabellon-gold-500 focus:ring-offset-2 rounded px-2 py-1"
              aria-label="Limpiar todos los filtros"
            >
              Limpiar todo
            </button>
          )}
        </div>

        {/* Contador de resultados */}
        <div className="mt-3 text-sm sm:text-base text-pabellon-green-700 font-medium" aria-live="polite">
          Mostrando <span className="text-pabellon-gold-600 font-bold">{totalResults}</span> de{" "}
          <span className="text-pabellon-gold-600 font-bold">{totalAthletes}</span> exaltados
        </div>
      </div>

      {/* Filtros */}
      <div className="p-4 sm:p-6 space-y-6">
        {/* 1. BÚSQUEDA DE TEXTO */}
        <div>
          <label
            htmlFor="search-input"
            className="block text-sm font-semibold text-pabellon-green-800 mb-2"
          >
            Buscar por nombre, deporte o biografía
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon
                className="h-5 w-5 text-pabellon-gold-500"
                aria-hidden="true"
              />
            </div>
            <input
              id="search-input"
              type="text"
              value={filters.searchText}
              onChange={(e) => onSearchTextChange(e.target.value)}
              placeholder="Ej: Roberto Clemente, Béisbol..."
              className="block w-full pl-10 pr-10 py-3 border-2 border-pabellon-brown rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pabellon-gold-500 focus:border-transparent transition-all duration-200"
              aria-label="Campo de búsqueda de texto"
              autoComplete="off"
            />
            {filters.searchText && (
              <button
                onClick={() => onSearchTextChange("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Limpiar búsqueda"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* 2. FILTRO POR DEPORTE (Multi-select) */}
        <div>
          <label className="block text-sm font-semibold text-pabellon-green-800 mb-3">
            Deportes
            {filters.deportes.length > 0 && (
              <span className="ml-2 text-xs font-normal text-pabellon-gold-600">
                ({filters.deportes.length} seleccionado{filters.deportes.length !== 1 ? "s" : ""})
              </span>
            )}
          </label>
          <div
            className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 bg-gray-50 rounded-lg border border-pabellon-brown"
            role="group"
            aria-label="Filtro de deportes"
          >
            {availableDeportes.map((deporte) => {
              const isSelected = filters.deportes.includes(deporte);
              return (
                <button
                  key={deporte}
                  onClick={() => handleDeporteToggle(deporte)}
                  className={`relative flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pabellon-gold-500 ${
                    isSelected
                      ? "bg-pabellon-green-700 text-white border-pabellon-green-700 shadow-md"
                      : "bg-white text-gray-700 border-pabellon-brown hover:border-pabellon-gold-500 hover:bg-pabellon-gold-50"
                  }`}
                  aria-pressed={isSelected}
                  aria-label={`${isSelected ? "Deseleccionar" : "Seleccionar"} deporte ${deporte}`}
                >
                  {isSelected && (
                    <CheckIcon className="w-4 h-4 mr-1" aria-hidden="true" />
                  )}
                  <span className="truncate">{deporte}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. FILTRO POR DÉCADA */}
        <div>
          <label
            htmlFor="decada-select"
            className="block text-sm font-semibold text-pabellon-green-800 mb-2"
          >
            Década de exaltación
          </label>
          <select
            id="decada-select"
            value={filters.decada}
            onChange={(e) => onDecadaChange(e.target.value as DecadaExaltacion)}
            className="block w-full px-4 py-3 border-2 border-pabellon-brown rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-pabellon-gold-500 focus:border-transparent transition-all duration-200 bg-white"
            aria-label="Seleccionar década de exaltación"
          >
            {DECADAS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* 4. FILTRO POR CATEGORÍA (Pills) */}
        <div>
          <label className="block text-sm font-semibold text-pabellon-green-800 mb-3">
            Categoría
            {filters.categorias.length > 0 && (
              <span className="ml-2 text-xs font-normal text-pabellon-gold-600">
                ({filters.categorias.length} seleccionada{filters.categorias.length !== 1 ? "s" : ""})
              </span>
            )}
          </label>
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label="Filtro de categorías"
          >
            {availableCategorias.map((categoria) => {
              const isSelected = filters.categorias.includes(categoria);
              const label = CATEGORIA_LABELS[categoria] || categoria;

              return (
                <button
                  key={categoria}
                  onClick={() => handleCategoriaToggle(categoria)}
                  className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pabellon-gold-500 ${
                    isSelected
                      ? "bg-pabellon-gold-600 text-white border-pabellon-gold-600 shadow-md"
                      : "bg-white text-gray-700 border-pabellon-brown hover:border-pabellon-gold-500 hover:bg-pabellon-gold-50"
                  }`}
                  aria-pressed={isSelected}
                  aria-label={`${isSelected ? "Deseleccionar" : "Seleccionar"} categoría ${label}`}
                >
                  {isSelected && (
                    <CheckIcon className="w-4 h-4 mr-1" aria-hidden="true" />
                  )}
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. FILTRO POR ESTADO (Toggle) */}
        <div>
          <label className="block text-sm font-semibold text-pabellon-green-800 mb-3">
            Estado
          </label>
          <div
            className="flex flex-col sm:flex-row gap-2"
            role="radiogroup"
            aria-label="Filtro por estado del exaltado"
          >
            {(["todos", "activos", "fallecidos"] as EstadoExaltado[]).map((estado) => {
              const isSelected = filters.estado === estado;
              const labels = {
                todos: "Todos",
                activos: "Activos",
                fallecidos: "Fallecidos",
              };

              return (
                <button
                  key={estado}
                  onClick={() => onEstadoChange(estado)}
                  className={`flex-1 px-4 py-3 text-sm font-medium rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pabellon-gold-500 ${
                    isSelected
                      ? "bg-pabellon-green-700 text-white border-pabellon-green-700 shadow-md"
                      : "bg-white text-gray-700 border-pabellon-brown hover:border-pabellon-gold-500 hover:bg-pabellon-gold-50"
                  }`}
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={`Mostrar ${labels[estado].toLowerCase()}`}
                >
                  {labels[estado]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Resumen de filtros activos */}
        {hasActiveFilters && (
          <div className="pt-4 border-t-2 border-pabellon-brown">
            <h3 className="text-sm font-semibold text-pabellon-green-800 mb-2">
              Filtros activos:
            </h3>
            <div className="space-y-2 text-xs">
              {filters.searchText.trim() && (
                <div className="flex items-start gap-2">
                  <span className="font-medium text-pabellon-gold-600 min-w-fit">Texto:</span>
                  <span className="text-gray-700 break-words">&quot;{filters.searchText}&quot;</span>
                </div>
              )}
              {filters.deportes.length > 0 && (
                <div className="flex items-start gap-2">
                  <span className="font-medium text-pabellon-gold-600 min-w-fit">Deportes:</span>
                  <span className="text-gray-700">{filters.deportes.join(", ")}</span>
                </div>
              )}
              {filters.decada !== "todos" && (
                <div className="flex items-start gap-2">
                  <span className="font-medium text-pabellon-gold-600 min-w-fit">Década:</span>
                  <span className="text-gray-700">{filters.decada}</span>
                </div>
              )}
              {filters.categorias.length > 0 && (
                <div className="flex items-start gap-2">
                  <span className="font-medium text-pabellon-gold-600 min-w-fit">Categorías:</span>
                  <span className="text-gray-700">
                    {filters.categorias.map(c => CATEGORIA_LABELS[c] || c).join(", ")}
                  </span>
                </div>
              )}
              {filters.estado !== "todos" && (
                <div className="flex items-start gap-2">
                  <span className="font-medium text-pabellon-gold-600 min-w-fit">Estado:</span>
                  <span className="text-gray-700">
                    {filters.estado === "activos" ? "Activos" : "Fallecidos"}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
