"use client";

import { Squares2X2Icon, ListBulletIcon } from "@heroicons/react/24/outline";

type ViewMode = "grid" | "list";

interface ViewToggleProps {
  viewMode: ViewMode;
  onChange: (mode: ViewMode) => void;
  className?: string;
}

export function ViewToggle({
  viewMode,
  onChange,
  className = "",
}: ViewToggleProps) {
  return (
    <div
      className={`flex items-center bg-gray-100 rounded-lg p-1 ${className}`}
    >
      <button
        onClick={() => onChange("grid")}
        className={`flex items-center justify-center px-3 py-2 rounded-md transition-all duration-200 ${
          viewMode === "grid"
            ? "bg-white text-pabellon-green-700 shadow-sm"
            : "text-gray-500 hover:text-gray-700"
        }`}
        aria-label="Vista en cuadrícula"
        title="Vista en cuadrícula"
      >
        <Squares2X2Icon className="w-5 h-5" />
      </button>

      <button
        onClick={() => onChange("list")}
        className={`flex items-center justify-center px-3 py-2 rounded-md transition-all duration-200 ${
          viewMode === "list"
            ? "bg-white text-pabellon-green-700 shadow-sm"
            : "text-gray-500 hover:text-gray-700"
        }`}
        aria-label="Vista en lista"
        title="Vista en lista"
      >
        <ListBulletIcon className="w-5 h-5" />
      </button>
    </div>
  );
}
