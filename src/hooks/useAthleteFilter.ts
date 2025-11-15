/**
 * useAthleteFilter.ts
 *
 * Custom hook para manejar el filtrado avanzado de exaltados del Pabellón de la Fama.
 * Incluye:
 * - Filtrado múltiple acumulativo
 * - Búsqueda de texto con debounce
 * - Sincronización con URL query params
 * - Performance optimizada < 100ms
 */

"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { debounce } from "@/lib/utils";
import { type Exaltado, type CategoriaExaltado } from "@/lib/types";

// Re-exportar CategoriaExaltado para que esté disponible desde este módulo
export type { CategoriaExaltado } from "@/lib/types";

// ============================================
// TIPOS PARA EL HOOK
// ============================================

export type DecadaExaltacion = "1980s" | "1990s" | "2000s" | "2010s" | "2020s" | "todos";

export type EstadoExaltado = "todos" | "activos" | "fallecidos";

export interface AthleteFilters {
  // Búsqueda de texto
  searchText: string;

  // Filtros múltiples
  deportes: string[];
  decada: DecadaExaltacion;
  categorias: CategoriaExaltado[];
  estado: EstadoExaltado;
}

export interface UseAthleteFilterOptions {
  initialData: Exaltado[];
  debounceMs?: number;
}

export interface UseAthleteFilterReturn {
  // Datos filtrados
  filteredAthletes: Exaltado[];

  // Estado de filtros
  filters: AthleteFilters;

  // Acciones
  setSearchText: (text: string) => void;
  setDeportes: (deportes: string[]) => void;
  setDecada: (decada: DecadaExaltacion) => void;
  setCategorias: (categorias: CategoriaExaltado[]) => void;
  setEstado: (estado: EstadoExaltado) => void;
  clearAllFilters: () => void;

  // Información útil
  totalAthletes: number;
  hasActiveFilters: boolean;

  // Datos para los controles de filtros
  availableDeportes: string[];
  availableCategorias: CategoriaExaltado[];
}

// ============================================
// CONSTANTES
// ============================================

const EMPTY_FILTERS: AthleteFilters = {
  searchText: "",
  deportes: [],
  decada: "todos",
  categorias: [],
  estado: "todos",
};

// ============================================
// FUNCIONES AUXILIARES
// ============================================

/**
 * Obtiene el rango de años para una década
 */
function getDecadaRange(decada: DecadaExaltacion): [number, number] | null {
  switch (decada) {
    case "1980s": return [1980, 1989];
    case "1990s": return [1990, 1999];
    case "2000s": return [2000, 2009];
    case "2010s": return [2010, 2019];
    case "2020s": return [2020, 2029];
    case "todos": return null;
    default: return null;
  }
}

/**
 * Filtra un exaltado según la búsqueda de texto
 */
function matchesSearchText(athlete: Exaltado, searchText: string): boolean {
  if (!searchText.trim()) return true;

  const search = searchText.toLowerCase().trim();

  // Búsqueda en campos básicos
  const basicFields = [
    athlete.nombre,
    athlete.apellidos,
    athlete.nombreCompleto,
    athlete.biografia,
    athlete.apodo,
    athlete.lugarNacimiento,
  ].filter(Boolean).some(field =>
    field?.toString().toLowerCase().includes(search)
  );

  // Búsqueda en deportes
  const deporteMatch = athlete.deporte.some(d =>
    d.toLowerCase().includes(search)
  );

  // Búsqueda en logros
  const logrosMatch = Array.isArray(athlete.logros)
    ? athlete.logros.some(logro =>
        typeof logro === 'string'
          ? logro.toLowerCase().includes(search)
          : logro.titulo?.toLowerCase().includes(search)
      )
    : false;

  return basicFields || deporteMatch || logrosMatch;
}

/**
 * Filtra un exaltado según todos los filtros activos
 */
function applyFilters(athlete: Exaltado, filters: AthleteFilters): boolean {
  // Filtro de búsqueda de texto
  if (!matchesSearchText(athlete, filters.searchText)) {
    return false;
  }

  // Filtro por deportes (OR - al menos uno coincide)
  if (filters.deportes.length > 0) {
    const hasMatchingDeporte = athlete.deporte.some(d =>
      filters.deportes.includes(d)
    );
    if (!hasMatchingDeporte) return false;
  }

  // Filtro por década
  if (filters.decada !== "todos") {
    const range = getDecadaRange(filters.decada);
    if (range) {
      const [inicio, fin] = range;
      if (athlete.anoExaltacion < inicio || athlete.anoExaltacion > fin) {
        return false;
      }
    }
  }

  // Filtro por categorías (OR - al menos una coincide)
  if (filters.categorias.length > 0) {
    if (!filters.categorias.includes(athlete.categoria)) {
      return false;
    }
  }

  // Filtro por estado
  if (filters.estado !== "todos") {
    if (filters.estado === "activos" && athlete.estado !== "activo") {
      return false;
    }
    if (filters.estado === "fallecidos" && athlete.estado !== "fallecido") {
      return false;
    }
  }

  return true;
}

/**
 * Parsea los query params de la URL a filtros
 */
function parseQueryParams(searchParams: URLSearchParams): Partial<AthleteFilters> {
  const filters: Partial<AthleteFilters> = {};

  // Texto de búsqueda
  const searchText = searchParams.get("q");
  if (searchText) filters.searchText = searchText;

  // Deportes (puede ser múltiple: ?deporte=Beisbol&deporte=Boxeo)
  const deportes = searchParams.getAll("deporte");
  if (deportes.length > 0) filters.deportes = deportes;

  // Década
  const decada = searchParams.get("decada") as DecadaExaltacion;
  if (decada && ["1980s", "1990s", "2000s", "2010s", "2020s", "todos"].includes(decada)) {
    filters.decada = decada;
  }

  // Categorías
  const categorias = searchParams.getAll("categoria") as CategoriaExaltado[];
  if (categorias.length > 0) filters.categorias = categorias;

  // Estado
  const estado = searchParams.get("estado") as EstadoExaltado;
  if (estado && ["todos", "activos", "fallecidos"].includes(estado)) {
    filters.estado = estado;
  }

  return filters;
}

/**
 * Construye los query params desde los filtros
 */
function buildQueryParams(filters: AthleteFilters): URLSearchParams {
  const params = new URLSearchParams();

  // Solo agregar params si tienen valores activos
  if (filters.searchText.trim()) {
    params.set("q", filters.searchText.trim());
  }

  filters.deportes.forEach(deporte => {
    params.append("deporte", deporte);
  });

  if (filters.decada !== "todos") {
    params.set("decada", filters.decada);
  }

  filters.categorias.forEach(categoria => {
    params.append("categoria", categoria);
  });

  if (filters.estado !== "todos") {
    params.set("estado", filters.estado);
  }

  return params;
}

// ============================================
// CUSTOM HOOK
// ============================================

export function useAthleteFilter({
  initialData,
  debounceMs = 300,
}: UseAthleteFilterOptions): UseAthleteFilterReturn {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Estado de filtros
  const [filters, setFilters] = useState<AthleteFilters>(() => ({
    ...EMPTY_FILTERS,
    ...parseQueryParams(searchParams),
  }));

  // Estado interno para la búsqueda (antes del debounce)
  const [internalSearchText, setInternalSearchText] = useState(filters.searchText);

  // ============================================
  // SINCRONIZACIÓN CON URL
  // ============================================

  /**
   * Actualiza la URL con los filtros actuales
   */
  const updateURL = useCallback((newFilters: AthleteFilters) => {
    const params = buildQueryParams(newFilters);
    const queryString = params.toString();
    const newURL = queryString ? `${pathname}?${queryString}` : pathname;

    // Usar replace para no llenar el historial
    router.replace(newURL, { scroll: false });
  }, [router, pathname]);

  /**
   * Lee filtros de la URL cuando cambian los search params
   */
  useEffect(() => {
    const urlFilters = parseQueryParams(searchParams);
    setFilters(() => ({
      ...EMPTY_FILTERS,
      ...urlFilters,
    }));
    setInternalSearchText(urlFilters.searchText || "");
  }, [searchParams]);

  // ============================================
  // FILTRADO DE DATOS
  // ============================================

  /**
   * Aplica todos los filtros a los datos
   * Memoizado para performance
   */
  const filteredAthletes = useMemo(() => {
    const startTime = performance.now();

    const result = initialData.filter(athlete =>
      applyFilters(athlete, filters)
    );

    const endTime = performance.now();
    const duration = endTime - startTime;

    // Log de performance (solo en desarrollo)
    if (process.env.NODE_ENV === 'development') {
      console.log(`[useAthleteFilter] Filtrado completado en ${duration.toFixed(2)}ms`);
    }

    return result;
  }, [initialData, filters]);

  // ============================================
  // DATOS PARA CONTROLES DE UI
  // ============================================

  /**
   * Lista de deportes únicos disponibles
   */
  const availableDeportes = useMemo(() => {
    const deportes = new Set<string>();
    initialData.forEach(athlete => {
      athlete.deporte.forEach(d => deportes.add(d));
    });
    return Array.from(deportes).sort((a, b) => a.localeCompare(b, "es"));
  }, [initialData]);

  /**
   * Lista de categorías únicas disponibles
   */
  const availableCategorias = useMemo(() => {
    const categorias = new Set<CategoriaExaltado>();
    initialData.forEach(athlete => {
      categorias.add(athlete.categoria);
    });
    return Array.from(categorias).sort((a, b) => a.localeCompare(b, "es"));
  }, [initialData]);

  // ============================================
  // ACCIONES
  // ============================================

  /**
   * Debounced search text handler
   */
  const debouncedSetSearchText = useMemo(
    () => debounce((...args: unknown[]) => {
      const text = args[0] as string;
      const newFilters = { ...filters, searchText: text };
      setFilters(newFilters);
      updateURL(newFilters);
    }, debounceMs),
    [filters, updateURL, debounceMs]
  );

  /**
   * Handler para cambiar texto de búsqueda
   */
  const setSearchText = useCallback((text: string) => {
    setInternalSearchText(text);
    debouncedSetSearchText(text);
  }, [debouncedSetSearchText]);

  /**
   * Handler para cambiar deportes
   */
  const setDeportes = useCallback((deportes: string[]) => {
    const newFilters = { ...filters, deportes };
    setFilters(newFilters);
    updateURL(newFilters);
  }, [filters, updateURL]);

  /**
   * Handler para cambiar década
   */
  const setDecada = useCallback((decada: DecadaExaltacion) => {
    const newFilters = { ...filters, decada };
    setFilters(newFilters);
    updateURL(newFilters);
  }, [filters, updateURL]);

  /**
   * Handler para cambiar categorías
   */
  const setCategorias = useCallback((categorias: CategoriaExaltado[]) => {
    const newFilters = { ...filters, categorias };
    setFilters(newFilters);
    updateURL(newFilters);
  }, [filters, updateURL]);

  /**
   * Handler para cambiar estado
   */
  const setEstado = useCallback((estado: EstadoExaltado) => {
    const newFilters = { ...filters, estado };
    setFilters(newFilters);
    updateURL(newFilters);
  }, [filters, updateURL]);

  /**
   * Limpia todos los filtros
   */
  const clearAllFilters = useCallback(() => {
    setFilters(EMPTY_FILTERS);
    setInternalSearchText("");
    updateURL(EMPTY_FILTERS);
  }, [updateURL]);

  // ============================================
  // INFORMACIÓN ÚTIL
  // ============================================

  const hasActiveFilters = useMemo(() => {
    return filters.searchText.trim() !== "" ||
           filters.deportes.length > 0 ||
           filters.decada !== "todos" ||
           filters.categorias.length > 0 ||
           filters.estado !== "todos";
  }, [filters]);

  // ============================================
  // RETURN
  // ============================================

  return {
    // Datos filtrados
    filteredAthletes,

    // Estado de filtros (usar internalSearchText para el input)
    filters: {
      ...filters,
      searchText: internalSearchText,
    },

    // Acciones
    setSearchText,
    setDeportes,
    setDecada,
    setCategorias,
    setEstado,
    clearAllFilters,

    // Información útil
    totalAthletes: initialData.length,
    hasActiveFilters,

    // Datos para controles
    availableDeportes,
    availableCategorias,
  };
}
