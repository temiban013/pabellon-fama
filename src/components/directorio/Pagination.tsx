"use client";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/outline";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  maxVisiblePages?: number;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  maxVisiblePages = 5,
  className = "",
}: PaginationProps) {
  // No mostrar paginación si hay una sola página
  if (totalPages <= 1) return null;

  // Calcular el rango de páginas visibles
  const getVisiblePages = () => {
    const half = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, currentPage - half);
    const end = Math.min(totalPages, start + maxVisiblePages - 1);

    // Ajustar el inicio si estamos cerca del final
    if (end - start < maxVisiblePages - 1) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const visiblePages = getVisiblePages();
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  const buttonBaseClass =
    "inline-flex items-center justify-center px-3 py-2 text-sm font-medium transition-colors duration-200 border";

  const activeButtonClass =
    "bg-pabellon-green-700 text-white border-pabellon-green-700 hover:bg-pabellon-green-800";

  const inactiveButtonClass =
    "bg-white text-gray-500 border-gray-300 hover:bg-gray-50 hover:text-gray-700";

  const disabledButtonClass =
    "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed";

  return (
    <nav
      className={`flex items-center justify-center space-x-1 ${className}`}
      aria-label="Paginación"
    >
      {/* Primera página */}
      {showFirstLast && !isFirstPage && (
        <button
          onClick={() => onPageChange(1)}
          className={`${buttonBaseClass} ${inactiveButtonClass} rounded-l-lg`}
          aria-label="Primera página"
        >
          <ChevronDoubleLeftIcon className="w-4 h-4" />
        </button>
      )}

      {/* Página anterior */}
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={isFirstPage}
        className={`${buttonBaseClass} ${
          isFirstPage ? disabledButtonClass : inactiveButtonClass
        } ${!showFirstLast || isFirstPage ? "rounded-l-lg" : ""}`}
        aria-label="Página anterior"
      >
        <ChevronLeftIcon className="w-4 h-4" />
      </button>

      {/* Elipsis al inicio */}
      {visiblePages[0] > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className={`${buttonBaseClass} ${inactiveButtonClass}`}
          >
            1
          </button>
          {visiblePages[0] > 2 && (
            <span className="inline-flex items-center px-3 py-2 text-sm text-gray-500">
              ...
            </span>
          )}
        </>
      )}

      {/* Páginas visibles */}
      {visiblePages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`${buttonBaseClass} ${
            page === currentPage ? activeButtonClass : inactiveButtonClass
          }`}
          aria-label={`Página ${page}`}
          aria-current={page === currentPage ? "page" : undefined}
        >
          {page}
        </button>
      ))}

      {/* Elipsis al final */}
      {visiblePages[visiblePages.length - 1] < totalPages && (
        <>
          {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
            <span className="inline-flex items-center px-3 py-2 text-sm text-gray-500">
              ...
            </span>
          )}
          <button
            onClick={() => onPageChange(totalPages)}
            className={`${buttonBaseClass} ${inactiveButtonClass}`}
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Página siguiente */}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={isLastPage}
        className={`${buttonBaseClass} ${
          isLastPage ? disabledButtonClass : inactiveButtonClass
        } ${!showFirstLast || isLastPage ? "rounded-r-lg" : ""}`}
        aria-label="Página siguiente"
      >
        <ChevronRightIcon className="w-4 h-4" />
      </button>

      {/* Última página */}
      {showFirstLast && !isLastPage && (
        <button
          onClick={() => onPageChange(totalPages)}
          className={`${buttonBaseClass} ${inactiveButtonClass} rounded-r-lg`}
          aria-label="Última página"
        >
          <ChevronDoubleRightIcon className="w-4 h-4" />
        </button>
      )}
    </nav>
  );
}
