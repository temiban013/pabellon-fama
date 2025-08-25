"use client";

import { useState } from "react";
import { ExaltadoCard } from "./ExaltadoCard";
import { ExaltadoModal } from "./ExaltadoModal";
import { Pagination } from "./Pagination";
import { type Exaltado } from "@/lib/types";

interface DirectorioGridProps {
  exaltados: Exaltado[];
  itemsPerPage?: number;
  showPagination?: boolean;
}

export function DirectorioGrid({ 
  exaltados, 
  itemsPerPage = 12,
  showPagination = true 
}: DirectorioGridProps) {
  const [selectedExaltado, setSelectedExaltado] = useState<Exaltado | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Calcular paginación
  const totalItems = exaltados.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedExaltados = showPagination 
    ? exaltados.slice(startIndex, startIndex + itemsPerPage)
    : exaltados;

  const handleExaltadoClick = (exaltado: Exaltado) => {
    setSelectedExaltado(exaltado);
  };

  const handleCloseModal = () => {
    setSelectedExaltado(null);
  };

  if (exaltados.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          No se encontraron exaltados
        </h3>
        <p className="text-gray-600">
          No hay exaltados en esta categoría
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Grid de exaltados */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedExaltados.map((exaltado) => (
          <ExaltadoCard
            key={exaltado.id}
            exaltado={exaltado}
            viewMode="grid"
            onClick={() => handleExaltadoClick(exaltado)}
          />
        ))}
      </div>

      {/* Paginación */}
      {showPagination && totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Modal de detalles */}
      {selectedExaltado && (
        <ExaltadoModal
          exaltado={selectedExaltado}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}