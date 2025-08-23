"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { ExaltadoCard } from "./ExaltadoCard";
import { SearchBar } from "./SearchBar";
import { FilterPanel } from "./FilterPanel";
import { ViewToggle } from "./ViewToggle";
import { ExaltadoModal } from "./ExaltadoModal";
import { Pagination } from "./Pagination";
import {
  type Exaltado,
  type FiltrosDirectorio,
  type CategoriaExaltado,
} from "@/lib/types";
import { debounce } from "@/lib/utils";
import exaltadosData from "@/data/exaltados.json";

type ViewMode = "grid" | "list";
type SortOption = "nombre" | "ano" | "deporte";
type SortDirection = "asc" | "desc";

// Función para aplanar los datos organizados por deporte en una lista
function flattenExaltadosData(): Exaltado[] {
  const exaltados: Exaltado[] = [];

  // Mapeo de categorías del JSON a las categorías del tipo
  const categoriaMap: Record<string, CategoriaExaltado> = {
    jugadores: "atleta",
    propulsores: "promotor",
    dirigentes: "dirigente",
  };

  Object.entries(exaltadosData).forEach(([deporte, categorias]) => {
    if (deporte === "estadisticas") return;

    Object.entries(categorias as Record<string, Exaltado[]>).forEach(
      ([categoria, personas]) => {
        personas.forEach((persona) => {
          exaltados.push({
            ...persona,
            categoria: categoriaMap[categoria] || "atleta",
          });
        });
      }
    );
  });

  return exaltados;
}

interface DirectorioClientProps {
  className?: string;
}

export function DirectorioClient({ className = "" }: DirectorioClientProps) {
  // Estados principales
  const [allExaltados] = useState<Exaltado[]>(flattenExaltadosData());
  const [filteredExaltados, setFilteredExaltados] = useState<Exaltado[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<FiltrosDirectorio>({});
  const [sortBy, setSortBy] = useState<SortOption>("nombre");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedExaltado, setSelectedExaltado] = useState<Exaltado | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Aplicar filtros, búsqueda y ordenamiento
  const applyFiltersAndSort = useCallback(
    (
      searchTerm: string,
      filters: FiltrosDirectorio,
      sortBy: SortOption,
      direction: SortDirection
    ) => {
      let filtered = [...allExaltados];

      // Aplicar búsqueda
      if (searchTerm.trim()) {
        const search = searchTerm.toLowerCase().trim();
        filtered = filtered.filter(
          (exaltado) =>
            exaltado.nombre.toLowerCase().includes(search) ||
            exaltado.apellidos?.toLowerCase().includes(search) ||
            exaltado.deporte.some((d) => d.toLowerCase().includes(search)) ||
            exaltado.biografia?.toLowerCase().includes(search)
        );
      }

      // Aplicar filtros por deporte
      if (filters.deporte?.length) {
        filtered = filtered.filter((exaltado) =>
          exaltado.deporte.some((d) => filters.deporte?.includes(d))
        );
      }

      // Aplicar filtros por categoría
      if (filters.categoria?.length) {
        filtered = filtered.filter((exaltado) =>
          filters.categoria?.includes(exaltado.categoria)
        );
      }

      // Aplicar filtros por año
      if (filters.anoDesde) {
        filtered = filtered.filter(
          (exaltado) => exaltado.anoExaltacion >= filters.anoDesde!
        );
      }
      if (filters.anoHasta) {
        filtered = filtered.filter(
          (exaltado) => exaltado.anoExaltacion <= filters.anoHasta!
        );
      }

      // Aplicar ordenamiento
      filtered.sort((a, b) => {
        let comparison = 0;

        switch (sortBy) {
          case "nombre":
            comparison = a.nombre.localeCompare(b.nombre, "es");
            break;
          case "ano":
            comparison = a.anoExaltacion - b.anoExaltacion;
            break;
          case "deporte":
            comparison = a.deporte[0].localeCompare(b.deporte[0], "es");
            break;
        }

        return direction === "asc" ? comparison : -comparison;
      });

      setFilteredExaltados(filtered);
    },
    [allExaltados]
  );

  // Función de búsqueda con debounce
  const debouncedSearch = useMemo(
    () =>
      debounce((term: unknown) => {
        if (typeof term === "string") {
          setCurrentPage(1); // Reset page when searching
          applyFiltersAndSort(term, filters, sortBy, sortDirection);
        }
      }, 300),
    [filters, sortBy, sortDirection, applyFiltersAndSort]
  );

  // Handlers
  const handleSearchChange = useCallback(
    (term: string) => {
      setSearchTerm(term);
      debouncedSearch(term as unknown);
    },
    [debouncedSearch]
  );

  const handleFilterChange = useCallback(
    (newFilters: FiltrosDirectorio) => {
      setFilters(newFilters);
      setCurrentPage(1);
      applyFiltersAndSort(searchTerm, newFilters, sortBy, sortDirection);
    },
    [searchTerm, sortBy, sortDirection, applyFiltersAndSort]
  );

  const handleSortChange = useCallback(
    (field: SortOption, direction: SortDirection) => {
      setSortBy(field);
      setSortDirection(direction);
      applyFiltersAndSort(searchTerm, filters, field, direction);
    },
    [searchTerm, filters, applyFiltersAndSort]
  );

  const handleExaltadoClick = useCallback((exaltado: Exaltado) => {
    setSelectedExaltado(exaltado);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedExaltado(null);
  }, []);

  // Inicializar datos
  useEffect(() => {
    applyFiltersAndSort("", {}, "nombre", "asc");
    setIsLoading(false);
  }, [applyFiltersAndSort]);

  // Calcular datos para paginación
  const totalItems = filteredExaltados.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedExaltados = filteredExaltados.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Obtener listas únicas para filtros
  const availableDeportes = useMemo(() => {
    const deportes = new Set<string>();
    allExaltados.forEach((exaltado) => {
      exaltado.deporte.forEach((d) => deportes.add(d));
    });
    return Array.from(deportes).sort((a, b) => a.localeCompare(b, "es"));
  }, [allExaltados]);

  const availableCategorias = useMemo(() => {
    const categorias = new Set(allExaltados.map((e) => e.categoria));
    return Array.from(categorias).sort((a, b) => a.localeCompare(b, "es"));
  }, [allExaltados]);

  const availableAnos = useMemo(() => {
    const anos = new Set(allExaltados.map((e) => e.anoExaltacion));
    return Array.from(anos).sort((a, b) => a - b);
  }, [allExaltados]);

  if (isLoading) {
    return (
      <div className={`py-12 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-200 h-64 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className={`py-8 lg:py-12 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Controles principales */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          {/* Búsqueda */}
          <div className="flex-1">
            <SearchBar
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Buscar por nombre, deporte o biografía..."
            />
          </div>

          {/* Toggle de vista */}
          <ViewToggle viewMode={viewMode} onChange={setViewMode} />
        </div>

        {/* Panel de filtros y resultados */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar con filtros */}
          <div className="lg:w-80 flex-shrink-0">
            <FilterPanel
              filters={filters}
              onFiltersChange={handleFilterChange}
              sortBy={sortBy}
              sortDirection={sortDirection}
              onSortChange={handleSortChange}
              availableDeportes={availableDeportes}
              availableCategorias={availableCategorias}
              availableAnos={availableAnos}
            />
          </div>

          {/* Área principal de resultados */}
          <div className="flex-1">
            {/* Header de resultados */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold text-pabellon-green-800">
                  {totalItems} exaltado{totalItems !== 1 ? "s" : ""}{" "}
                  {searchTerm || Object.keys(filters).length > 0
                    ? "encontrado"
                    : ""}
                  {totalItems !== 1 ? "s" : ""}
                </h2>
                {searchTerm && (
                  <p className="text-sm text-gray-600 mt-1">
                    Resultados para: &quot;{searchTerm}&quot;
                  </p>
                )}
              </div>

              {totalPages > 1 && (
                <div className="text-sm text-gray-600">
                  Página {currentPage} de {totalPages}
                </div>
              )}
            </div>

            {/* Grid/Lista de exaltados */}
            {paginatedExaltados.length > 0 ? (
              <>
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                      : "space-y-4"
                  }
                >
                  {paginatedExaltados.map((exaltado) => (
                    <ExaltadoCard
                      key={exaltado.id}
                      exaltado={exaltado}
                      viewMode={viewMode}
                      onClick={() => handleExaltadoClick(exaltado)}
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
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No se encontraron exaltados
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm
                    ? `No hay resultados para "${searchTerm}"`
                    : "No hay exaltados que coincidan con los filtros seleccionados"}
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilters({});
                    setCurrentPage(1);
                    applyFiltersAndSort("", {}, sortBy, sortDirection);
                  }}
                  className="btn-pabellon"
                >
                  Limpiar filtros
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Modal de detalles */}
        {selectedExaltado && (
          <ExaltadoModal
            exaltado={selectedExaltado}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </section>
  );
}
