"use client";

import { useEffect } from "react";
import Image from "next/image";
import {
  XMarkIcon,
  CalendarIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";
import { type Exaltado } from "@/lib/types";
import { getInitials, capitalize } from "@/lib/utils";

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

  const initials = getInitials(exaltado.nombre);

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
      "Deportes Varios": "🏆",
      "Cronista Deportivo": "📝",
    };
    return emojis[deporte as keyof typeof emojis] || "🏆";
  };

  const getCategoryColor = (categoria: string) => {
    const colors = {
      atleta: "bg-blue-100 text-blue-800 border-blue-200",
      jugador: "bg-green-100 text-green-800 border-green-200",
      propulsor: "bg-purple-100 text-purple-800 border-purple-200",
      entrenador: "bg-orange-100 text-orange-800 border-orange-200",
      arbitro: "bg-yellow-100 text-yellow-800 border-yellow-200",
      cronista: "bg-indigo-100 text-indigo-800 border-indigo-200",
      equipo: "bg-red-100 text-red-800 border-red-200",
      boxeador: "bg-red-100 text-red-800 border-red-200",
      "atleta-propulsor": "bg-teal-100 text-teal-800 border-teal-200",
      "jugador-propulsor": "bg-cyan-100 text-cyan-800 border-cyan-200",
    };
    return (
      colors[categoria as keyof typeof colors] ||
      "bg-gray-100 text-gray-800 border-gray-200"
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-pabellon-green-800 to-pabellon-green-900 px-6 py-4 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
            aria-label="Cerrar modal"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>

          <div className="pr-12">
            <h2 className="text-2xl lg:text-3xl font-bold mb-2">
              {exaltado.nombre}
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              {exaltado.deporte.map((deporte, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-medium"
                >
                  <span className="text-lg">{getSportEmoji(deporte)}</span>
                  {deporte}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-h-[calc(90vh-120px)] overflow-y-auto">
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Imagen y datos básicos */}
              <div className="lg:col-span-1">
                {/* Imagen */}
                <div className="relative h-64 lg:h-80 bg-gradient-to-br from-pabellon-green-50 to-pabellon-gold-50 rounded-lg overflow-hidden border border-pabellon-gold-200 mb-6">
                  {exaltado.foto ? (
                    <Image
                      src={exaltado.foto}
                      alt={`Foto de ${exaltado.nombre}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-pabellon-gold-400 to-pabellon-gold-600 flex items-center justify-center text-white font-bold text-4xl shadow-lg">
                        {initials}
                      </div>
                    </div>
                  )}
                </div>

                {/* Información básica */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-pabellon-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Año de exaltación</p>
                      <p className="font-semibold text-pabellon-green-800">
                        {exaltado.anoExaltacion}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <TrophyIcon className="w-5 h-5 text-pabellon-gold-600" />
                    <div>
                      <p className="text-sm text-gray-600">Año de Exaltación</p>
                      <p className="font-semibold text-pabellon-gold-700">
                        {exaltado.anoExaltacion}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-1">Categoría</p>
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(
                        exaltado.categoria
                      )}`}
                    >
                      {capitalize(exaltado.categoria)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Biografía y detalles */}
              <div className="lg:col-span-2">
                <div className="space-y-6">
                  {/* Biografía */}
                  <div>
                    <h3 className="text-xl font-semibold text-pabellon-green-800 mb-3">
                      Biografía
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {exaltado.biografia ||
                        "Información biográfica no disponible."}
                    </p>
                  </div>

                  {/* Logros (si están disponibles) */}
                  {exaltado.logros && exaltado.logros.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold text-pabellon-green-800 mb-3">
                        Logros Destacados
                      </h3>
                      <ul className="space-y-2">
                        {exaltado.logros.map((logro, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-pabellon-gold-500 mt-1">
                              •
                            </span>
                            <div>
                              <p className="font-medium text-gray-800">
                                {logro.titulo}
                              </p>
                              <p className="text-sm text-gray-600">
                                {logro.descripcion}
                              </p>
                              <p className="text-xs text-gray-500">
                                {logro.ano}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Reconocimientos (si están disponibles) */}
                  {exaltado.reconocimientos &&
                    exaltado.reconocimientos.length > 0 && (
                      <div>
                        <h3 className="text-xl font-semibold text-pabellon-green-800 mb-3">
                          Reconocimientos
                        </h3>
                        <ul className="space-y-2">
                          {exaltado.reconocimientos.map(
                            (reconocimiento, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-2"
                              >
                                <span className="text-pabellon-gold-500 mt-1">
                                  •
                                </span>
                                <div>
                                  <p className="font-medium text-gray-800">
                                    {reconocimiento.titulo}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    Otorgado por: {reconocimiento.otorgadoPor}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {reconocimiento.fecha
                                      ? new Date(
                                          reconocimiento.fecha
                                        ).getFullYear()
                                      : ""}
                                  </p>
                                </div>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}

                  {/* Deportes detallados */}
                  <div>
                    <h3 className="text-xl font-semibold text-pabellon-green-800 mb-3">
                      {exaltado.deporte.length > 1 ? "Deportes" : "Deporte"}
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {exaltado.deporte.map((deporte, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 bg-pabellon-gold-100 text-pabellon-gold-800 px-4 py-2 rounded-lg border border-pabellon-gold-200"
                        >
                          <span className="text-2xl">
                            {getSportEmoji(deporte)}
                          </span>
                          <span className="font-medium">{deporte}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Exaltado en {exaltado.anoExaltacion}
            </p>
            <button onClick={onClose} className="btn-pabellon">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
