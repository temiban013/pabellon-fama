"use client";

import { useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { type Exaltado } from "@/lib/types";
import { ExaltadoDetailLayout } from "@/components/shared/ExaltadoDetailLayout";

interface ExaltadoModalProps {
  exaltado: Exaltado;
  onClose: () => void;
}

export function ExaltadoModal({ exaltado, onClose }: ExaltadoModalProps) {
  // Cerrar modal con ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden"; // Prevenir scroll del body

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  const getSportEmoji = (deporte: string) => {
    const emojis = {
      Atletismo: "🏃",
      Béisbol: "⚾",
      Baloncesto: "🏀",
      Boxeo: "🥊",
      Fútbol: "⚽",
      Voleibol: "🏐",
      Natación: "🏊",
      Ciclismo: "🚴",
      Tenis: "🎾",
      Golf: "⛳",
      "Paso Fino": "🐎",
      "Levantamiento de pesas": "🏋️",
      "Lucha Olímpica": "🤼",
      "Artes Marciales": "🥋",
      Tiro: "🎯",
      Gallos: "🐓",
      "Deportes Varios": "🏆",
      "Cronista Deportivo": "📝",
    };
    return emojis[deporte as keyof typeof emojis] || "🏆";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-2 sm:p-4 pt-8 sm:pt-16">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[calc(100vh-4rem)] flex flex-col animate-fade-in-up">
        {/* Fixed Header */}
        <div className="relative bg-gradient-to-r from-pabellon-green-800 to-pabellon-green-900 px-4 sm:px-6 py-4 text-white rounded-t-2xl flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors z-10"
            aria-label="Cerrar modal"
          >
            <XMarkIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <div className="pr-12">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 line-clamp-2">
              {exaltado.nombre}
            </h2>
            <div className="flex flex-wrap items-center gap-1 sm:gap-2">
              {exaltado.deporte.map((deporte, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 bg-white bg-opacity-20 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium"
                >
                  <span className="text-sm sm:text-lg">{getSportEmoji(deporte)}</span>
                  <span className="hidden sm:inline">{deporte}</span>
                  <span className="sm:hidden">{deporte.split(' ')[0]}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="p-4 sm:p-6">
            <ExaltadoDetailLayout exaltado={exaltado} />
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="border-t border-gray-200 px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 rounded-b-2xl flex-shrink-0">
          <div className="flex justify-between items-center">
            <p className="text-xs sm:text-sm text-gray-600">
              Exaltado en {exaltado.anoExaltacion}
              {exaltado.exaltacion && (
                <span className="block sm:inline sm:ml-2 text-pabellon-gold-600 font-medium">
                  {exaltado.exaltacion}
                </span>
              )}
            </p>
            <button onClick={onClose} className="btn-pabellon text-sm px-3 py-1.5 sm:px-4 sm:py-2">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
