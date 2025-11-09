"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { CalendarIcon, MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { type Exaltado } from "@/lib/types";
import { getInitials, capitalize } from "@/lib/utils";
import { formatBiography } from "@/lib/utils/biography";
import {
  getCategoryColorWithBorder,
  getSportEmoji,
  getCategoryLabel,
} from "@/lib/constants/exaltados";

interface ExaltadoDetailLayoutProps {
  exaltado: Exaltado;
}

/**
 * Shared layout component for displaying exaltado details
 * Used by both ExaltadoModal and full page routes
 * Sprint 10 - SEO & Navigation Unification
 * Sprint 11A Phase 5 - Photo zoom modal
 */
export function ExaltadoDetailLayout({ exaltado }: ExaltadoDetailLayoutProps) {
  const initials = getInitials(exaltado.nombre);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isPhotoModalOpen) {
        setIsPhotoModalOpen(false);
      }
    };

    if (isPhotoModalOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isPhotoModalOpen]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
      {/* Imagen y datos básicos */}
      <div className="lg:col-span-1">
        {/* Imagen */}
        <div className="relative h-60 sm:h-80 lg:h-96 bg-gradient-to-br from-pabellon-green-50 to-pabellon-gold-50 rounded-lg overflow-hidden border border-pabellon-gold-200 mb-4 sm:mb-6 group">
          {exaltado.foto ? (
            <>
              <Image
                src={exaltado.foto}
                alt={`Foto de ${exaltado.nombre}`}
                fill
                className="object-cover"
                style={{ objectPosition: 'center 20%' }}
                sizes="(max-width: 1024px) 100vw, 25vw"
              />
              {/* Enlarge button overlay */}
              <button
                onClick={() => setIsPhotoModalOpen(true)}
                className="absolute top-2 right-2 bg-pabellon-green-800 bg-opacity-80 hover:bg-opacity-100 text-white p-2 rounded-full shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-pabellon-gold-400"
                title="Ampliar foto"
                aria-label="Ampliar foto"
              >
                <MagnifyingGlassIcon className="w-5 h-5" />
              </button>
            </>
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
              <p className="text-xs sm:text-sm text-gray-600">
                Año de exaltación
              </p>
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
              <p className="text-xs sm:text-sm text-gray-600 mb-1">
                Fecha de nacimiento
              </p>
              <p className="font-medium text-sm sm:text-base text-gray-800">
                {String(exaltado.fechaNacimiento)}
              </p>
            </div>
          )}

          {exaltado.fechaFallecimiento && (
            <div className="border-l-2 border-gray-200 pl-3">
              <p className="text-xs sm:text-sm text-gray-600 mb-1">
                Fecha de fallecimiento
              </p>
              <p className="font-medium text-sm sm:text-base text-gray-800">
                {String(exaltado.fechaFallecimiento)}
              </p>
            </div>
          )}

          {exaltado.lugarNacimiento && (
            <div className="border-l-2 border-pabellon-gold-200 pl-3">
              <p className="text-xs sm:text-sm text-gray-600 mb-1">
                Lugar de nacimiento
              </p>
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

          {/* Categoría - Enhanced with colored card */}
          <div className="border-t pt-3">
            <p className="text-xs sm:text-sm text-gray-600 mb-2">Categoría</p>
            <Link
              href={`/directorio?categoria=${encodeURIComponent(exaltado.categoria)}`}
              className={`block rounded-lg p-3 border-2 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer ${getCategoryColorWithBorder(
                exaltado.categoria
              )}`}
              title={`Ver todos los ${getCategoryLabel(exaltado.categoria)}s`}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">
                  {exaltado.categoria.toLowerCase().includes('atleta') || exaltado.categoria.toLowerCase().includes('jugador') || exaltado.categoria.toLowerCase().includes('boxeador') ? '🏃' :
                   exaltado.categoria.toLowerCase().includes('propulsor') ? '🌟' :
                   exaltado.categoria.toLowerCase().includes('equipo') ? '👥' :
                   exaltado.categoria.toLowerCase().includes('póstumo') ? '🕊️' : '🏆'}
                </span>
                <span className="font-bold text-sm sm:text-base uppercase tracking-wide">
                  {getCategoryLabel(exaltado.categoria)}
                </span>
              </div>
            </Link>
          </div>

          {/* Deportes - Compact sidebar version */}
          <div className="border-t pt-3 mt-3">
            <p className="text-xs sm:text-sm text-gray-600 mb-2">
              {exaltado.deporte.length > 1 ? "Deportes" : "Deporte"}
            </p>
            <div className="space-y-2">
              {exaltado.deporte.map((deporte, index) => (
                <Link
                  key={index}
                  href={`/directorio?deporte=${encodeURIComponent(deporte)}`}
                  className="flex items-center gap-2 bg-gradient-to-r from-pabellon-gold-50 to-pabellon-green-50 border border-pabellon-gold-300 rounded-lg px-3 py-2 shadow-sm hover:shadow-md hover:border-pabellon-gold-400 transition-all duration-200 cursor-pointer"
                  title={`Ver todos los exaltados de ${deporte}`}
                >
                  <span className="text-base">{getSportEmoji(deporte)}</span>
                  <span className="font-semibold text-xs sm:text-sm text-pabellon-green-800">
                    {deporte}
                  </span>
                </Link>
              ))}
            </div>
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
            <div className="space-y-4">
              {exaltado.biografia ? (
                formatBiography(exaltado.biografia).map((paragraph, index) => (
                  <p
                    key={index}
                    className="text-sm sm:text-base text-gray-700 leading-relaxed"
                  >
                    {paragraph}
                  </p>
                ))
              ) : (
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Información biográfica no disponible.
                </p>
              )}
            </div>
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
                  <li
                    key={index}
                    className="flex items-start gap-3 bg-white bg-opacity-70 rounded-md p-3"
                  >
                    <span className="text-pabellon-gold-500 mt-1 flex-shrink-0">
                      <span className="w-2 h-2 bg-pabellon-gold-500 rounded-full inline-block"></span>
                    </span>
                    <div className="flex-1 min-w-0">
                      {typeof logro === "string" ? (
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
          {exaltado.reconocimientos && exaltado.reconocimientos.length > 0 && (
            <div className="bg-gradient-to-r from-pabellon-green-50 to-pabellon-gold-50 border border-pabellon-green-200 rounded-lg p-4">
              <h3 className="text-lg sm:text-xl font-semibold text-pabellon-green-800 mb-3 flex items-center gap-2">
                <span className="text-xl">🏅</span>
                Reconocimientos
              </h3>
              <ul className="space-y-3">
                {exaltado.reconocimientos.map((reconocimiento, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 bg-white bg-opacity-70 rounded-md p-3"
                  >
                    <span className="text-pabellon-green-500 mt-1 flex-shrink-0">
                      <span className="w-2 h-2 bg-pabellon-green-500 rounded-full inline-block"></span>
                    </span>
                    <div className="flex-1 min-w-0">
                      {typeof reconocimiento === "string" ? (
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
                              ? new Date(reconocimiento.fecha).getFullYear()
                              : ""}
                          </p>
                        </>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Información de carrera/especialidades */}
          {(exaltado.especialidad ||
            exaltado.posicion ||
            exaltado.carreraEntrenador ||
            exaltado.carreraMLB ||
            exaltado.carreraOlimpica ||
            exaltado.equipos ||
            exaltado.clubes ||
            exaltado.seleccionNacional ||
            exaltado.participacionOlimpica ||
            exaltado.carreraAcademica ||
            exaltado.rol ||
            exaltado.contribucion) && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-lg sm:text-xl font-semibold text-pabellon-green-800 mb-3 flex items-center gap-2">
                <span className="text-xl">💼</span>
                Carrera y Contribuciones
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {exaltado.especialidad && (
                  <div className="bg-white rounded-md p-3">
                    <p className="text-xs sm:text-sm font-medium text-blue-600 mb-1">
                      Especialidad
                    </p>
                    <p className="text-sm sm:text-base text-gray-800">
                      {exaltado.especialidad}
                    </p>
                  </div>
                )}
                {exaltado.posicion && (
                  <div className="bg-white rounded-md p-3">
                    <p className="text-xs sm:text-sm font-medium text-blue-600 mb-1">
                      Posición
                    </p>
                    <p className="text-sm sm:text-base text-gray-800">
                      {exaltado.posicion}
                    </p>
                  </div>
                )}
                {exaltado.rol && (
                  <div className="bg-white rounded-md p-3">
                    <p className="text-xs sm:text-sm font-medium text-blue-600 mb-1">
                      Rol
                    </p>
                    <p className="text-sm sm:text-base text-gray-800">
                      {exaltado.rol}
                    </p>
                  </div>
                )}
                {exaltado.equipos && exaltado.equipos.length > 0 && (
                  <div className="bg-white rounded-md p-3 sm:col-span-2">
                    <p className="text-xs sm:text-sm font-medium text-blue-600 mb-1">
                      Equipos
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {exaltado.equipos.map((equipo, idx) => (
                        <span
                          key={idx}
                          className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                        >
                          {equipo}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {exaltado.clubes && exaltado.clubes.length > 0 && (
                  <div className="bg-white rounded-md p-3 sm:col-span-2">
                    <p className="text-xs sm:text-sm font-medium text-blue-600 mb-1">
                      Clubes
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {exaltado.clubes.map((club, idx) => (
                        <span
                          key={idx}
                          className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                        >
                          {club}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {exaltado.seleccionNacional && (
                  <div className="bg-white rounded-md p-3 sm:col-span-2">
                    <p className="text-xs sm:text-sm font-medium text-blue-600 mb-1">
                      Selección Nacional
                    </p>
                    <p className="text-sm sm:text-base text-gray-800">
                      {exaltado.seleccionNacional}
                    </p>
                  </div>
                )}
                {exaltado.carreraEntrenador && (
                  <div className="bg-white rounded-md p-3 sm:col-span-2">
                    <p className="text-xs sm:text-sm font-medium text-blue-600 mb-1">
                      Carrera como Entrenador
                    </p>
                    <p className="text-sm sm:text-base text-gray-800">
                      {exaltado.carreraEntrenador}
                    </p>
                  </div>
                )}
                {exaltado.participacionOlimpica && (
                  <div className="bg-white rounded-md p-3 sm:col-span-2">
                    <p className="text-xs sm:text-sm font-medium text-blue-600 mb-1">
                      Participación Olímpica
                    </p>
                    <p className="text-sm sm:text-base text-gray-800">
                      {exaltado.participacionOlimpica}
                    </p>
                  </div>
                )}
                {exaltado.carreraAcademica && (
                  <div className="bg-white rounded-md p-3 sm:col-span-2">
                    <p className="text-xs sm:text-sm font-medium text-blue-600 mb-1">
                      Carrera Académica
                    </p>
                    <p className="text-sm sm:text-base text-gray-800">
                      {exaltado.carreraAcademica}
                    </p>
                  </div>
                )}
                {exaltado.contribucion && (
                  <div className="bg-white rounded-md p-3 sm:col-span-2">
                    <p className="text-xs sm:text-sm font-medium text-blue-600 mb-1">
                      Contribución
                    </p>
                    <p className="text-sm sm:text-base text-gray-800">
                      {exaltado.contribucion}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Additional Career Information - MLB, Olympic, Administrative, etc. */}
          {(exaltado.carreraMLB ||
            exaltado.carreraOlimpica ||
            exaltado.carreraAdministrativa ||
            exaltado.rolesPrincipales ||
            exaltado.cargosPrincipales ||
            exaltado.deportesPromovidos ||
            exaltado.familia ||
            exaltado.logroPionero ||
            exaltado.record ||
            exaltado.campeonatos) && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="text-lg sm:text-xl font-semibold text-pabellon-green-800 mb-3 flex items-center gap-2">
                <span className="text-xl">⭐</span>
                Información Detallada
              </h3>
              <div className="space-y-3">
                {exaltado.carreraMLB && (
                  <div className="bg-white rounded-md p-3">
                    <p className="text-xs sm:text-sm font-medium text-purple-600 mb-2">
                      Carrera en Grandes Ligas (MLB)
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs sm:text-sm">
                      {Object.entries(exaltado.carreraMLB).map(
                        ([key, value]) => (
                          <div key={key} className="">
                            <span className="font-medium text-gray-600">
                              {key}:
                            </span>
                            <span className="ml-1 text-gray-800">
                              {Array.isArray(value)
                                ? value.join(", ")
                                : String(value)}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
                {exaltado.carreraOlimpica && (
                  <div className="bg-white rounded-md p-3">
                    <p className="text-xs sm:text-sm font-medium text-purple-600 mb-2">
                      Carrera Olímpica
                    </p>
                    <div className="space-y-1">
                      {Object.entries(exaltado.carreraOlimpica).map(
                        ([key, value]) => (
                          <div key={key} className="text-xs sm:text-sm">
                            <span className="font-medium text-gray-600">
                              {key}:
                            </span>
                            <span className="ml-1 text-gray-800">
                              {String(value)}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
                {exaltado.carreraAdministrativa && (
                  <div className="bg-white rounded-md p-3">
                    <p className="text-xs sm:text-sm font-medium text-purple-600 mb-2">
                      Carrera Administrativa
                    </p>
                    <div className="space-y-1">
                      {Object.entries(exaltado.carreraAdministrativa).map(
                        ([key, value]) => (
                          <div key={key} className="text-xs sm:text-sm">
                            <span className="font-medium text-gray-600">
                              {key}:
                            </span>
                            <span className="ml-1 text-gray-800">
                              {String(value)}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
                {exaltado.rolesPrincipales && (
                  <div className="bg-white rounded-md p-3">
                    <p className="text-xs sm:text-sm font-medium text-purple-600 mb-2">
                      Roles Principales
                    </p>
                    <div className="space-y-1">
                      {Object.entries(exaltado.rolesPrincipales).map(
                        ([key, value]) => (
                          <div key={key} className="text-xs sm:text-sm">
                            <span className="font-medium text-gray-600">
                              {key}:
                            </span>
                            <span className="ml-1 text-gray-800">
                              {String(value)}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
                {exaltado.cargosPrincipales && (
                  <div className="bg-white rounded-md p-3">
                    <p className="text-xs sm:text-sm font-medium text-purple-600 mb-2">
                      Cargos Principales
                    </p>
                    <div className="space-y-1">
                      {Object.entries(exaltado.cargosPrincipales).map(
                        ([key, value]) => (
                          <div key={key} className="text-xs sm:text-sm">
                            <span className="font-medium text-gray-600">
                              {key}:
                            </span>
                            <span className="ml-1 text-gray-800">
                              {String(value)}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
                {exaltado.deportesPromovidos &&
                  exaltado.deportesPromovidos.length > 0 && (
                    <div className="bg-white rounded-md p-3">
                      <p className="text-xs sm:text-sm font-medium text-purple-600 mb-2">
                        Deportes Promovidos
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {exaltado.deportesPromovidos.map((deporte, idx) => (
                          <span
                            key={idx}
                            className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs"
                          >
                            {deporte}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                {exaltado.familia && (
                  <div className="bg-white rounded-md p-3">
                    <p className="text-xs sm:text-sm font-medium text-purple-600 mb-1">
                      Información Familiar
                    </p>
                    <p className="text-xs sm:text-sm text-gray-800">
                      {exaltado.familia}
                    </p>
                  </div>
                )}
                {exaltado.logroPionero && (
                  <div className="bg-white rounded-md p-3">
                    <p className="text-xs sm:text-sm font-medium text-purple-600 mb-1">
                      Logro Pionero
                    </p>
                    <p className="text-xs sm:text-sm text-gray-800">
                      {exaltado.logroPionero}
                    </p>
                  </div>
                )}
                {exaltado.record && (
                  <div className="bg-white rounded-md p-3">
                    <p className="text-xs sm:text-sm font-medium text-purple-600 mb-1">
                      Récord
                    </p>
                    <p className="text-xs sm:text-sm text-gray-800">
                      {exaltado.record}
                    </p>
                  </div>
                )}
                {exaltado.campeonatos && (
                  <div className="bg-white rounded-md p-3">
                    <p className="text-xs sm:text-sm font-medium text-purple-600 mb-2">
                      Campeonatos
                    </p>
                    <div className="space-y-1">
                      {Object.entries(exaltado.campeonatos).map(
                        ([key, value]) => (
                          <div key={key} className="text-xs sm:text-sm">
                            <span className="font-medium text-gray-600">
                              {key}:
                            </span>
                            <span className="ml-1 text-gray-800">
                              {String(value)}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Photo zoom modal */}
      {isPhotoModalOpen && exaltado.foto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4"
          onClick={() => setIsPhotoModalOpen(false)}
        >
          <div className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center">
            {/* Close button */}
            <button
              onClick={() => setIsPhotoModalOpen(false)}
              className="absolute top-4 right-4 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 z-10 focus:outline-none focus:ring-2 focus:ring-pabellon-gold-400"
              title="Cerrar"
              aria-label="Cerrar modal"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>

            {/* Image container */}
            <div
              className="relative w-full h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={exaltado.foto}
                alt={`Foto ampliada de ${exaltado.nombre}`}
                fill
                className="object-contain"
                sizes="90vw"
                quality={100}
                priority
              />
            </div>

            {/* Caption */}
            <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg text-center">
              <p className="font-semibold text-lg">{exaltado.nombreCompleto}</p>
              {exaltado.apodo && (
                <p className="text-sm text-gray-300">&quot;{exaltado.apodo}&quot;</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
