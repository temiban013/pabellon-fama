"use client";

import { useState, useMemo } from "react";
import { ExaltadoCard } from "./ExaltadoCard";
import { SearchFilters } from "./SearchFilters";
import { ViewToggle } from "./ViewToggle";
import { Pagination } from "./Pagination";
import { useAthleteFilter } from "@/hooks/useAthleteFilter";
import {
  type Exaltado,
  type CategoriaExaltado,
} from "@/lib/types";
import { todosLosExaltados } from "@/data/exaltados-all";
import type { ExaltadoRevista } from "@/lib/types/revista";

type ViewMode = "grid" | "list";
// Note: SortOption and SortDirection types removed - not currently used
// Can be re-added when sorting functionality is implemented

// Mapeo de categorías de revista a las categorías del tipo
const categoriaMap: Record<string, CategoriaExaltado> = {
  "ATLETA": "atleta",
  "PROPULSOR": "propulsor",
  "DIRIGENTE": "dirigente",
  "COMUNICADOR": "cronista",
  "PÓSTUMO": "atleta", // Póstumo es más un estado, la mayoría son atletas
  "EQUIPO": "equipo",
};

// Función para transformar ExaltadoRevista a Exaltado
function transformExaltadoRevista(exaltadoRevista: ExaltadoRevista): Exaltado {
  // Construct nombreCompleto from nombre + apellidos
  const nombreCompleto = `${exaltadoRevista.nombre} ${exaltadoRevista.apellidos}`.trim();

  return {
    id: exaltadoRevista.id,
    nombre: exaltadoRevista.nombre,
    apellidos: exaltadoRevista.apellidos,
    nombreCompleto,
    deporte: exaltadoRevista.deportes,
    categoria: categoriaMap[exaltadoRevista.categoria] || "atleta",
    anoExaltacion: exaltadoRevista.anoExaltacion,
    biografia: exaltadoRevista.contenido.biografia,
    logros: exaltadoRevista.contenido.logros || [],
    reconocimientos: exaltadoRevista.contenido.reconocimientos || [],
    foto: exaltadoRevista.foto,
    estado: "activo", // Default - we can enhance this later with actual data
    apodo: exaltadoRevista.apodo || null,
  };
}

// Función para obtener todos los exaltados transformados
function getAllExaltados(): Exaltado[] {
  return todosLosExaltados.map(transformExaltadoRevista);
}

interface DirectorioClientProps {
  className?: string;
}

export function DirectorioClient({ className = "" }: DirectorioClientProps) {
  // Obtener todos los exaltados
  const allExaltados = useMemo(() => getAllExaltados(), []);

  // Usar el custom hook para filtrado avanzado
  const {
    filteredAthletes,
    filters,
    setSearchText,
    setDeportes,
    setDecada,
    setCategorias,
    setEstado,
    clearAllFilters,
    totalAthletes,
    hasActiveFilters,
    availableDeportes,
    availableCategorias,
  } = useAthleteFilter({
    initialData: allExaltados,
    debounceMs: 300,
  });

  // Estados para UI
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Reset página cuando cambien los filtros
  // Usamos un efecto para detectar cambios en filteredAthletes
  const totalItems = filteredAthletes.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Calcular datos para paginación
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedExaltados = filteredAthletes.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <section className={`py-8 lg:py-12 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header con toggle de vista */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-pabellon-green-800">
            Directorio de Exaltados
          </h2>
          <ViewToggle viewMode={viewMode} onChange={setViewMode} />
        </div>

        {/* Panel de filtros y resultados */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Sidebar con filtros avanzados */}
          <div className="lg:w-96 flex-shrink-0">
            <div className="lg:sticky lg:top-6">
              <SearchFilters
                filters={filters}
                onSearchTextChange={(text) => {
                  setSearchText(text);
                  setCurrentPage(1);
                }}
                onDeportesChange={(deportes) => {
                  setDeportes(deportes);
                  setCurrentPage(1);
                }}
                onDecadaChange={(decada) => {
                  setDecada(decada);
                  setCurrentPage(1);
                }}
                onCategoriasChange={(categorias) => {
                  setCategorias(categorias);
                  setCurrentPage(1);
                }}
                onEstadoChange={(estado) => {
                  setEstado(estado);
                  setCurrentPage(1);
                }}
                onClearAll={() => {
                  clearAllFilters();
                  setCurrentPage(1);
                }}
                availableDeportes={availableDeportes}
                availableCategorias={availableCategorias}
                totalResults={totalItems}
                totalAthletes={totalAthletes}
              />
            </div>
          </div>

          {/* Área principal de resultados */}
          <div className="flex-1 min-w-0">
            {/* Header de paginación */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
                <span>
                  Página {currentPage} de {totalPages}
                </span>
              </div>
            )}

            {/* Grid/Lista de exaltados */}
            {paginatedExaltados.length > 0 ? (
              <>
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                      : "space-y-4"
                  }
                >
                  {paginatedExaltados.map((exaltado) => (
                    <ExaltadoCard
                      key={exaltado.id}
                      exaltado={exaltado}
                      viewMode={viewMode}
                    />
                  ))}
                </div>

                {/* Paginación */}
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-md border-2 border-pabellon-brown">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-pabellon-green-800 mb-2">
                  No se encontraron exaltados
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {hasActiveFilters
                    ? "Intenta ajustar los filtros para encontrar más resultados"
                    : "No hay exaltados disponibles"}
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={() => {
                      clearAllFilters();
                      setCurrentPage(1);
                    }}
                    className="px-6 py-3 bg-pabellon-gold-600 text-white font-medium rounded-lg hover:bg-pabellon-gold-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pabellon-gold-500"
                  >
                    Limpiar todos los filtros
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
