"use client";

import { useEffect } from "react";
import Image from "next/image";
import {
  XMarkIcon,
  CalendarIcon,
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
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
              {/* Imagen y datos básicos */}
              <div className="lg:col-span-1">
                {/* Imagen */}
                <div className="relative h-48 sm:h-64 lg:h-72 bg-gradient-to-br from-pabellon-green-50 to-pabellon-gold-50 rounded-lg overflow-hidden border border-pabellon-gold-200 mb-4 sm:mb-6">
                  {exaltado.foto ? (
                    <Image
                      src={exaltado.foto}
                      alt={`Foto de ${exaltado.nombre}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-pabellon-gold-400 to-pabellon-gold-600 flex items-center justify-center text-white font-bold text-2xl sm:text-4xl shadow-lg">
                        {initials}
                      </div>
                    </div>
                  )}
                </div>

                {/* Información básica */}
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start gap-2">
                    <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-pabellon-green-600 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm text-gray-600">Año de exaltación</p>
                      <p className="font-semibold text-sm sm:text-base text-pabellon-green-800">
                        {exaltado.anoExaltacion}
                      </p>
                      {exaltado.exaltacion && (
                        <p className="text-xs text-pabellon-gold-600 font-medium">
                          {exaltado.exaltacion}
                        </p>
                      )}
                    </div>
                  </div>

                  {exaltado.fechaNacimiento && (
                    <div className="border-l-2 border-pabellon-green-200 pl-3">
                      <p className="text-xs sm:text-sm text-gray-600 mb-1">Fecha de nacimiento</p>
                      <p className="font-medium text-sm sm:text-base text-gray-800">
                        {String(exaltado.fechaNacimiento)}
                      </p>
                    </div>
                  )}

                  {exaltado.fechaFallecimiento && (
                    <div className="border-l-2 border-gray-200 pl-3">
                      <p className="text-xs sm:text-sm text-gray-600 mb-1">Fecha de fallecimiento</p>
                      <p className="font-medium text-sm sm:text-base text-gray-800">
                        {String(exaltado.fechaFallecimiento)}
                      </p>
                    </div>
                  )}

                  {exaltado.lugarNacimiento && (
                    <div className="border-l-2 border-pabellon-gold-200 pl-3">
                      <p className="text-xs sm:text-sm text-gray-600 mb-1">Lugar de nacimiento</p>
                      <p className="font-medium text-sm sm:text-base text-gray-800">
                        {exaltado.lugarNacimiento}
                      </p>
                    </div>
                  )}

                  {exaltado.apodo && (
                    <div className="bg-pabellon-gold-50 border border-pabellon-gold-200 rounded-lg p-3">
                      <p className="text-xs sm:text-sm text-gray-600 mb-1">Apodo</p>
                      <p className="font-bold text-sm sm:text-base text-pabellon-gold-700">
                        &quot;{exaltado.apodo}&quot;
                      </p>
                    </div>
                  )}

                  <div className="border-t pt-3">
                    <p className="text-xs sm:text-sm text-gray-600 mb-2">Categoría</p>
                    <span
                      className={`inline-flex px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium border ${getCategoryColor(
                        exaltado.categoria
                      )}`}
                    >
                      {capitalize(exaltado.categoria)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Biografía y detalles */}
              <div className="lg:col-span-3">
                <div className="space-y-4 sm:space-y-6">
                  {/* Biografía */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg sm:text-xl font-semibold text-pabellon-green-800 mb-3 flex items-center gap-2">
                      <span className="text-xl">📖</span>
                      Biografía
                    </h3>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                      {exaltado.biografia ||
                        "Información biográfica no disponible."}
                    </p>
                  </div>

                  {/* Logros (si están disponibles) */}
                  {exaltado.logros && exaltado.logros.length > 0 && (
                    <div className="bg-gradient-to-r from-pabellon-gold-50 to-pabellon-green-50 border border-pabellon-gold-200 rounded-lg p-4">
                      <h3 className="text-lg sm:text-xl font-semibold text-pabellon-green-800 mb-3 flex items-center gap-2">
                        <span className="text-xl">🏆</span>
                        Logros Destacados
                      </h3>
                      <ul className="space-y-3">
                        {exaltado.logros.map((logro, index) => (
                          <li key={index} className="flex items-start gap-3 bg-white bg-opacity-70 rounded-md p-3">
                            <span className="text-pabellon-gold-500 mt-1 flex-shrink-0">
                              <span className="w-2 h-2 bg-pabellon-gold-500 rounded-full inline-block"></span>
                            </span>
                            <div className="flex-1 min-w-0">
                              {typeof logro === 'string' ? (
                                <p className="font-medium text-sm sm:text-base text-gray-800">
                                  {logro}
                                </p>
                              ) : (
                                <>
                                  <p className="font-medium text-sm sm:text-base text-gray-800">
                                    {logro.titulo}
                                  </p>
                                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                                    {logro.descripcion}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {logro.ano}
                                  </p>
                                </>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Reconocimientos (si están disponibles) */}
                  {exaltado.reconocimientos &&
                    exaltado.reconocimientos.length > 0 && (
                      <div className="bg-gradient-to-r from-pabellon-green-50 to-pabellon-gold-50 border border-pabellon-green-200 rounded-lg p-4">
                        <h3 className="text-lg sm:text-xl font-semibold text-pabellon-green-800 mb-3 flex items-center gap-2">
                          <span className="text-xl">🏅</span>
                          Reconocimientos
                        </h3>
                        <ul className="space-y-3">
                          {exaltado.reconocimientos.map(
                            (reconocimiento, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-3 bg-white bg-opacity-70 rounded-md p-3"
                              >
                                <span className="text-pabellon-green-500 mt-1 flex-shrink-0">
                                  <span className="w-2 h-2 bg-pabellon-green-500 rounded-full inline-block"></span>
                                </span>
                                <div className="flex-1 min-w-0">
                                  {typeof reconocimiento === 'string' ? (
                                    <p className="font-medium text-sm sm:text-base text-gray-800">
                                      {reconocimiento}
                                    </p>
                                  ) : (
                                    <>
                                      <p className="font-medium text-sm sm:text-base text-gray-800">
                                        {reconocimiento.titulo}
                                      </p>
                                      <p className="text-xs sm:text-sm text-gray-600 mt-1">
                                        Otorgado por: {reconocimiento.otorgadoPor}
                                      </p>
                                      <p className="text-xs text-gray-500 mt-1">
                                        {reconocimiento.fecha
                                          ? new Date(
                                              reconocimiento.fecha
                                            ).getFullYear()
                                          : ""}
                                      </p>
                                    </>
                                  )}
                                </div>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}

                  {/* Información de carrera/especialidades */}
                  {(exaltado.especialidad || exaltado.posicion || exaltado.carreraEntrenador ||
                    exaltado.carreraMLB || exaltado.carreraOlimpica || exaltado.equipos ||
                    exaltado.clubes || exaltado.seleccionNacional || exaltado.participacionOlimpica ||
                    exaltado.carreraAcademica || exaltado.rol || exaltado.contribucion) && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="text-lg sm:text-xl font-semibold text-pabellon-green-800 mb-3 flex items-center gap-2">
                        <span className="text-xl">💼</span>
                        Carrera y Contribuciones
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        {exaltado.especialidad && (
                          <div className="bg-white rounded-md p-3">
                            <p className="text-xs sm:text-sm font-medium text-blue-600 mb-1">Especialidad</p>
                            <p className="text-sm sm:text-base text-gray-800">{exaltado.especialidad}</p>
                          </div>
                        )}
                        {exaltado.posicion && (
                          <div className="bg-white rounded-md p-3">
                            <p className="text-xs sm:text-sm font-medium text-blue-600 mb-1">Posición</p>
                            <p className="text-sm sm:text-base text-gray-800">{exaltado.posicion}</p>
                          </div>
                        )}
                        {exaltado.rol && (
                          <div className="bg-white rounded-md p-3">
                            <p className="text-xs sm:text-sm font-medium text-blue-600 mb-1">Rol</p>
                            <p className="text-sm sm:text-base text-gray-800">{exaltado.rol}</p>
                          </div>
                        )}
                        {exaltado.equipos && exaltado.equipos.length > 0 && (
                          <div className="bg-white rounded-md p-3 sm:col-span-2">
                            <p className="text-xs sm:text-sm font-medium text-blue-600 mb-1">Equipos</p>
                            <div className="flex flex-wrap gap-1">
                              {exaltado.equipos.map((equipo, idx) => (
                                <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                  {equipo}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {exaltado.clubes && exaltado.clubes.length > 0 && (
                          <div className="bg-white rounded-md p-3 sm:col-span-2">
                            <p className="text-xs sm:text-sm font-medium text-blue-600 mb-1">Clubes</p>
                            <div className="flex flex-wrap gap-1">
                              {exaltado.clubes.map((club, idx) => (
                                <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                  {club}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {exaltado.seleccionNacional && (
                          <div className="bg-white rounded-md p-3 sm:col-span-2">
                            <p className="text-xs sm:text-sm font-medium text-blue-600 mb-1">Selección Nacional</p>
                            <p className="text-sm sm:text-base text-gray-800">{exaltado.seleccionNacional}</p>
                          </div>
                        )}
                        {exaltado.carreraEntrenador && (
                          <div className="bg-white rounded-md p-3 sm:col-span-2">
                            <p className="text-xs sm:text-sm font-medium text-blue-600 mb-1">Carrera como Entrenador</p>
                            <p className="text-sm sm:text-base text-gray-800">{exaltado.carreraEntrenador}</p>
                          </div>
                        )}
                        {exaltado.participacionOlimpica && (
                          <div className="bg-white rounded-md p-3 sm:col-span-2">
                            <p className="text-xs sm:text-sm font-medium text-blue-600 mb-1">Participación Olímpica</p>
                            <p className="text-sm sm:text-base text-gray-800">{exaltado.participacionOlimpica}</p>
                          </div>
                        )}
                        {exaltado.carreraAcademica && (
                          <div className="bg-white rounded-md p-3 sm:col-span-2">
                            <p className="text-xs sm:text-sm font-medium text-blue-600 mb-1">Carrera Académica</p>
                            <p className="text-sm sm:text-base text-gray-800">{exaltado.carreraAcademica}</p>
                          </div>
                        )}
                        {exaltado.contribucion && (
                          <div className="bg-white rounded-md p-3 sm:col-span-2">
                            <p className="text-xs sm:text-sm font-medium text-blue-600 mb-1">Contribución</p>
                            <p className="text-sm sm:text-base text-gray-800">{exaltado.contribucion}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Additional Career Information - MLB, Olympic, Administrative, etc. */}
                  {(exaltado.carreraMLB || exaltado.carreraOlimpica || exaltado.carreraAdministrativa || 
                    exaltado.rolesPrincipales || exaltado.cargosPrincipales || exaltado.deportesPromovidos ||
                    exaltado.familia || exaltado.logroPionero || exaltado.record || exaltado.campeonatos) && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <h3 className="text-lg sm:text-xl font-semibold text-pabellon-green-800 mb-3 flex items-center gap-2">
                        <span className="text-xl">⭐</span>
                        Información Detallada
                      </h3>
                      <div className="space-y-3">
                        {exaltado.carreraMLB && (
                          <div className="bg-white rounded-md p-3">
                            <p className="text-xs sm:text-sm font-medium text-purple-600 mb-2">Carrera en Grandes Ligas (MLB)</p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs sm:text-sm">
                              {Object.entries(exaltado.carreraMLB).map(([key, value]) => (
                                <div key={key} className="">
                                  <span className="font-medium text-gray-600">{key}:</span>
                                  <span className="ml-1 text-gray-800">
                                    {Array.isArray(value) ? value.join(', ') : String(value)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {exaltado.carreraOlimpica && (
                          <div className="bg-white rounded-md p-3">
                            <p className="text-xs sm:text-sm font-medium text-purple-600 mb-2">Carrera Olímpica</p>
                            <div className="space-y-1">
                              {Object.entries(exaltado.carreraOlimpica).map(([key, value]) => (
                                <div key={key} className="text-xs sm:text-sm">
                                  <span className="font-medium text-gray-600">{key}:</span>
                                  <span className="ml-1 text-gray-800">{String(value)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {exaltado.carreraAdministrativa && (
                          <div className="bg-white rounded-md p-3">
                            <p className="text-xs sm:text-sm font-medium text-purple-600 mb-2">Carrera Administrativa</p>
                            <div className="space-y-1">
                              {Object.entries(exaltado.carreraAdministrativa).map(([key, value]) => (
                                <div key={key} className="text-xs sm:text-sm">
                                  <span className="font-medium text-gray-600">{key}:</span>
                                  <span className="ml-1 text-gray-800">{String(value)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {exaltado.rolesPrincipales && (
                          <div className="bg-white rounded-md p-3">
                            <p className="text-xs sm:text-sm font-medium text-purple-600 mb-2">Roles Principales</p>
                            <div className="space-y-1">
                              {Object.entries(exaltado.rolesPrincipales).map(([key, value]) => (
                                <div key={key} className="text-xs sm:text-sm">
                                  <span className="font-medium text-gray-600">{key}:</span>
                                  <span className="ml-1 text-gray-800">{String(value)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {exaltado.cargosPrincipales && (
                          <div className="bg-white rounded-md p-3">
                            <p className="text-xs sm:text-sm font-medium text-purple-600 mb-2">Cargos Principales</p>
                            <div className="space-y-1">
                              {Object.entries(exaltado.cargosPrincipales).map(([key, value]) => (
                                <div key={key} className="text-xs sm:text-sm">
                                  <span className="font-medium text-gray-600">{key}:</span>
                                  <span className="ml-1 text-gray-800">{String(value)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {exaltado.deportesPromovidos && exaltado.deportesPromovidos.length > 0 && (
                          <div className="bg-white rounded-md p-3">
                            <p className="text-xs sm:text-sm font-medium text-purple-600 mb-2">Deportes Promovidos</p>
                            <div className="flex flex-wrap gap-1">
                              {exaltado.deportesPromovidos.map((deporte, idx) => (
                                <span key={idx} className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                                  {deporte}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {exaltado.familia && (
                          <div className="bg-white rounded-md p-3">
                            <p className="text-xs sm:text-sm font-medium text-purple-600 mb-1">Información Familiar</p>
                            <p className="text-xs sm:text-sm text-gray-800">{exaltado.familia}</p>
                          </div>
                        )}
                        {exaltado.logroPionero && (
                          <div className="bg-white rounded-md p-3">
                            <p className="text-xs sm:text-sm font-medium text-purple-600 mb-1">Logro Pionero</p>
                            <p className="text-xs sm:text-sm text-gray-800">{exaltado.logroPionero}</p>
                          </div>
                        )}
                        {exaltado.record && (
                          <div className="bg-white rounded-md p-3">
                            <p className="text-xs sm:text-sm font-medium text-purple-600 mb-1">Récord</p>
                            <p className="text-xs sm:text-sm text-gray-800">{exaltado.record}</p>
                          </div>
                        )}
                        {exaltado.campeonatos && (
                          <div className="bg-white rounded-md p-3">
                            <p className="text-xs sm:text-sm font-medium text-purple-600 mb-2">Campeonatos</p>
                            <div className="space-y-1">
                              {Object.entries(exaltado.campeonatos).map(([key, value]) => (
                                <div key={key} className="text-xs sm:text-sm">
                                  <span className="font-medium text-gray-600">{key}:</span>
                                  <span className="ml-1 text-gray-800">{String(value)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Deportes detallados */}
                  <div className="bg-gradient-to-br from-pabellon-green-50 to-pabellon-gold-50 border-2 border-pabellon-gold-300 rounded-lg p-4">
                    <h3 className="text-lg sm:text-xl font-semibold text-pabellon-green-800 mb-3 flex items-center gap-2">
                      <span className="text-xl">⚽</span>
                      {exaltado.deporte.length > 1 ? "Deportes" : "Deporte"}
                    </h3>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      {exaltado.deporte.map((deporte, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 bg-white bg-opacity-80 text-pabellon-gold-800 px-3 sm:px-4 py-2 rounded-lg border-2 border-pabellon-gold-300 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <span className="text-lg sm:text-2xl">
                            {getSportEmoji(deporte)}
                          </span>
                          <span className="font-semibold text-sm sm:text-base">{deporte}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
