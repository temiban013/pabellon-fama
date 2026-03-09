// components/contribucion/ExaltadoSelector.tsx
"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { todosLosExaltados } from "@/data/exaltados-all";

interface ExaltadoSelectorProps {
  value: string;
  onChange: (id: string, nombre: string) => void;
}

export default function ExaltadoSelector({
  value,
  onChange,
}: ExaltadoSelectorProps) {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleClickOutside, handleKeyDown]);

  const selectedExaltado = useMemo(
    () => todosLosExaltados.find((e) => e.id === value),
    [value]
  );

  const filteredExaltados = useMemo(() => {
    if (!search.trim()) return [];
    const lower = search.toLowerCase();
    return todosLosExaltados
      .filter(
        (e) =>
          e.nombre.toLowerCase().includes(lower) ||
          e.apellidos.toLowerCase().includes(lower) ||
          (e.apodo && e.apodo.toLowerCase().includes(lower)) ||
          e.deportes.some((d) => d.toLowerCase().includes(lower))
      )
      .slice(0, 10);
  }, [search]);

  const handleSelect = (id: string, nombre: string, apellidos: string, apodo?: string) => {
    const nombreCompleto = apodo
      ? `${nombre} "${apodo}" ${apellidos}`
      : `${nombre} ${apellidos}`;
    onChange(id, nombreCompleto);
    setSearch("");
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange("", "");
    setSearch("");
  };

  if (selectedExaltado) {
    return (
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          Exaltado Seleccionado
        </label>
        <div className="flex items-center gap-3 px-4 py-3 bg-pabellon-green-50 border border-pabellon-green-300 rounded-lg">
          <span className="flex-1 font-medium text-pabellon-green-800">
            {selectedExaltado.nombre}
            {selectedExaltado.apodo && ` "${selectedExaltado.apodo}"`}
            {` ${selectedExaltado.apellidos}`}
            <span className="text-sm text-pabellon-green-600 ml-2">
              ({selectedExaltado.deportes.join(", ")})
            </span>
          </span>
          <button
            type="button"
            onClick={handleClear}
            className="text-sm text-pabellon-green-600 hover:text-pabellon-green-800 underline"
          >
            Cambiar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="space-y-1 relative">
      <label className="block text-sm font-medium text-gray-700">
        Buscar Exaltado <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder="Escriba el nombre del exaltado..."
        role="combobox"
        aria-expanded={isOpen && filteredExaltados.length > 0}
        aria-controls="exaltado-listbox"
        aria-autocomplete="list"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pabellon-gold-500 focus:border-transparent outline-none transition-all hover:border-gray-400"
      />
      {isOpen && filteredExaltados.length > 0 && (
        <ul id="exaltado-listbox" role="listbox" className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredExaltados.map((e) => (
            <li key={e.id} role="option" aria-selected={false}>
              <button
                type="button"
                onClick={() => handleSelect(e.id, e.nombre, e.apellidos, e.apodo)}
                className="w-full text-left px-4 py-3 hover:bg-pabellon-gold-50 transition-colors border-b border-gray-100 last:border-b-0"
              >
                <span className="font-medium text-gray-900">
                  {e.nombre}
                  {e.apodo && <span className="text-pabellon-gold-700"> &ldquo;{e.apodo}&rdquo;</span>}
                  {` ${e.apellidos}`}
                </span>
                <span className="text-sm text-gray-500 ml-2">
                  {e.deportes.join(", ")} &middot; {e.anoExaltacion}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {isOpen && search.trim().length > 0 && filteredExaltados.length === 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg px-4 py-3 text-sm text-gray-500">
          No se encontraron exaltados con ese nombre
        </div>
      )}
    </div>
  );
}
