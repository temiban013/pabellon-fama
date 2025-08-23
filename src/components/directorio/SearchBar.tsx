"use client";

import { useState } from "react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Buscar exaltados...",
  className = "",
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = () => {
    onChange("");
  };

  return (
    <div className={`relative ${className}`}>
      {/* Icono de búsqueda */}
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <MagnifyingGlassIcon
          className={`h-5 w-5 transition-colors duration-200 ${
            isFocused ? "text-pabellon-gold-500" : "text-gray-400"
          }`}
        />
      </div>

      {/* Input de búsqueda */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className={`w-full pl-10 pr-10 py-3 border rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pabellon-gold-500 focus:border-transparent transition-all duration-200 ${
          isFocused
            ? "border-pabellon-gold-300 shadow-lg"
            : "border-gray-300 hover:border-gray-400"
        }`}
        autoComplete="off"
        spellCheck="false"
      />

      {/* Botón de limpiar */}
      {value && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <button
            type="button"
            onClick={handleClear}
            className="text-gray-400 hover:text-gray-600 focus:text-gray-600 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-pabellon-gold-500"
            aria-label="Limpiar búsqueda"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Sugerencias/Help text */}
      <div className="mt-2 text-xs text-gray-500">
        Busca por nombre, deporte, categoría o biografía
      </div>
    </div>
  );
}
