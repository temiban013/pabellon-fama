"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FotoHistorica } from "@/lib/types/revista";
import { X, ChevronLeft, ChevronRight, Calendar, BookOpen, Trophy, Users, ZoomIn, ZoomOut } from "lucide-react";

interface LightboxProps {
  foto: FotoHistorica;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  hasNext?: boolean;
  hasPrev?: boolean;
}

export function Lightbox({ foto, onClose, onNext, onPrev, hasNext, hasPrev }: LightboxProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [showMetadata, setShowMetadata] = useState(true);

  // Handle ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isZoomed) {
          setIsZoomed(false);
        } else {
          onClose();
        }
      }
      if (e.key === "ArrowLeft" && !isZoomed && hasPrev && onPrev) onPrev();
      if (e.key === "ArrowRight" && !isZoomed && hasNext && onNext) onNext();
      if (e.key === "z" || e.key === "Z") {
        setIsZoomed(!isZoomed);
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [onClose, onNext, onPrev, hasNext, hasPrev, isZoomed]);

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-95">
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        onClick={onClose}
      />

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 bg-white bg-opacity-10 hover:bg-opacity-20 text-white p-3 rounded-full transition-all duration-200 backdrop-blur-sm"
        aria-label="Cerrar"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Zoom Toggle Button */}
      <button
        onClick={toggleZoom}
        className="absolute top-4 right-20 z-50 bg-white bg-opacity-10 hover:bg-opacity-20 text-white p-3 rounded-full transition-all duration-200 backdrop-blur-sm"
        aria-label={isZoomed ? "Reducir" : "Ampliar"}
      >
        {isZoomed ? <ZoomOut className="h-6 w-6" /> : <ZoomIn className="h-6 w-6" />}
      </button>

      {/* Metadata Toggle (when zoomed) */}
      {isZoomed && (
        <button
          onClick={() => setShowMetadata(!showMetadata)}
          className="absolute top-4 left-4 z-50 bg-white bg-opacity-10 hover:bg-opacity-20 text-white px-4 py-2 rounded-full transition-all duration-200 backdrop-blur-sm text-sm font-medium"
        >
          {showMetadata ? "Ocultar Info" : "Mostrar Info"}
        </button>
      )}

      {/* Navigation Buttons */}
      {!isZoomed && hasPrev && onPrev && (
        <button
          onClick={onPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-50 bg-white bg-opacity-10 hover:bg-opacity-20 text-white p-3 rounded-full transition-all duration-200 backdrop-blur-sm"
          aria-label="Anterior"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}

      {!isZoomed && hasNext && onNext && (
        <button
          onClick={onNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-50 bg-white bg-opacity-10 hover:bg-opacity-20 text-white p-3 rounded-full transition-all duration-200 backdrop-blur-sm"
          aria-label="Siguiente"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}

      {/* Content Container */}
      {!isZoomed ? (
        // Normal View - Image fits screen with metadata below
        <div className="relative z-40 w-full h-full flex flex-col items-center justify-center px-4 py-20 md:py-24">
          {/* Image Container - Takes available space */}
          <div className="relative flex-1 w-full max-w-7xl flex items-center justify-center mb-6">
            <div className="relative max-h-full max-w-full">
              <Image
                src={foto.archivoUrl}
                alt={foto.titulo}
                width={1400}
                height={1050}
                className="max-h-[calc(100vh-20rem)] w-auto h-auto object-contain rounded-lg shadow-2xl"
                priority
                quality={100}
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            </div>
          </div>

          {/* Metadata Card */}
          <div className="bg-white rounded-lg shadow-2xl p-4 md:p-6 max-w-3xl w-full max-h-64 overflow-y-auto">
            {/* Title and Category */}
            <div className="flex items-start justify-between mb-3">
              <h2 className="text-lg md:text-2xl font-bold text-gray-900 flex-1">
                {foto.titulo}
              </h2>
              <span className={`ml-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shrink-0 ${
                foto.categoria === "equipo"
                  ? "bg-blue-100 text-blue-800"
                  : foto.categoria === "evento"
                  ? "bg-green-100 text-green-800"
                  : foto.categoria === "persona"
                  ? "bg-purple-100 text-purple-800"
                  : foto.categoria === "ceremonia"
                  ? "bg-orange-100 text-orange-800"
                  : "bg-gray-100 text-gray-800"
              }`}>
                {foto.categoria === "equipo" && "Equipo"}
                {foto.categoria === "evento" && "Evento"}
                {foto.categoria === "persona" && "Persona"}
                {foto.categoria === "ceremonia" && "Ceremonia"}
                {foto.categoria === "instalacion" && "Instalación"}
              </span>
            </div>

            {/* Description */}
            {foto.descripcion && (
              <p className="text-sm md:text-base text-gray-700 mb-3 leading-relaxed">
                {foto.descripcion}
              </p>
            )}

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
              {foto.año && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-pabellon-green-600" />
                  <div>
                    <div className="text-xs text-gray-500">Año</div>
                    <div className="font-semibold text-gray-900">{foto.año}</div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm">
                <BookOpen className="h-4 w-4 text-pabellon-green-600" />
                <div>
                  <div className="text-xs text-gray-500">Revista</div>
                  <div className="font-semibold text-gray-900">#{foto.revistaOrigen}</div>
                </div>
              </div>

              {foto.paginaOrigen && (
                <div className="flex items-center gap-2 text-sm">
                  <BookOpen className="h-4 w-4 text-pabellon-green-600" />
                  <div>
                    <div className="text-xs text-gray-500">Página</div>
                    <div className="font-semibold text-gray-900">{foto.paginaOrigen}</div>
                  </div>
                </div>
              )}

              {foto.deporteRelacionado && (
                <div className="flex items-center gap-2 text-sm">
                  <Trophy className="h-4 w-4 text-pabellon-green-600" />
                  <div>
                    <div className="text-xs text-gray-500">Deporte</div>
                    <div className="font-semibold text-gray-900">{foto.deporteRelacionado}</div>
                  </div>
                </div>
              )}
            </div>

            {/* People in Photo */}
            {foto.personasEnFoto && foto.personasEnFoto.length > 0 && (
              <div className="border-t border-gray-200 pt-3">
                <div className="flex items-start gap-2">
                  <Users className="h-4 w-4 text-pabellon-green-600 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 mb-1">Personas en la foto</div>
                    <div className="text-sm text-gray-900">
                      {foto.personasEnFoto.join(", ")}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Keyboard Hints */}
          <div className="text-white text-xs md:text-sm mt-4 text-center opacity-60">
            <span className="mr-4">ESC para cerrar</span>
            <span className="mr-4">Z para ampliar</span>
            {hasPrev && <span className="mr-4">← Anterior</span>}
            {hasNext && <span>Siguiente →</span>}
          </div>
        </div>
      ) : (
        // Zoomed View - Full size image with scrolling
        <div className="relative z-40 w-full h-full overflow-auto p-4">
          <div className="min-h-full flex flex-col items-center justify-start">
            {/* Full Size Image */}
            <div className="relative mb-6">
              <Image
                src={foto.archivoUrl}
                alt={foto.titulo}
                width={1400}
                height={1050}
                className="rounded-lg shadow-2xl"
                priority
                quality={100}
              />
            </div>

            {/* Metadata Card (collapsible in zoom mode) */}
            {showMetadata && (
              <div className="bg-white rounded-lg shadow-2xl p-6 max-w-3xl w-full mb-6">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 flex-1">
                    {foto.titulo}
                  </h2>
                  <span className={`ml-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    foto.categoria === "equipo"
                      ? "bg-blue-100 text-blue-800"
                      : foto.categoria === "evento"
                      ? "bg-green-100 text-green-800"
                      : foto.categoria === "persona"
                      ? "bg-purple-100 text-purple-800"
                      : foto.categoria === "ceremonia"
                      ? "bg-orange-100 text-orange-800"
                      : "bg-gray-100 text-gray-800"
                  }`}>
                    {foto.categoria === "equipo" && "Equipo"}
                    {foto.categoria === "evento" && "Evento"}
                    {foto.categoria === "persona" && "Persona"}
                    {foto.categoria === "ceremonia" && "Ceremonia"}
                    {foto.categoria === "instalacion" && "Instalación"}
                  </span>
                </div>

                {foto.descripcion && (
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {foto.descripcion}
                  </p>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {foto.año && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-pabellon-green-600" />
                      <div>
                        <div className="text-xs text-gray-500">Año</div>
                        <div className="font-semibold text-gray-900">{foto.año}</div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm">
                    <BookOpen className="h-4 w-4 text-pabellon-green-600" />
                    <div>
                      <div className="text-xs text-gray-500">Revista</div>
                      <div className="font-semibold text-gray-900">#{foto.revistaOrigen}</div>
                    </div>
                  </div>

                  {foto.paginaOrigen && (
                    <div className="flex items-center gap-2 text-sm">
                      <BookOpen className="h-4 w-4 text-pabellon-green-600" />
                      <div>
                        <div className="text-xs text-gray-500">Página</div>
                        <div className="font-semibold text-gray-900">{foto.paginaOrigen}</div>
                      </div>
                    </div>
                  )}

                  {foto.deporteRelacionado && (
                    <div className="flex items-center gap-2 text-sm">
                      <Trophy className="h-4 w-4 text-pabellon-green-600" />
                      <div>
                        <div className="text-xs text-gray-500">Deporte</div>
                        <div className="font-semibold text-gray-900">{foto.deporteRelacionado}</div>
                      </div>
                    </div>
                  )}
                </div>

                {foto.personasEnFoto && foto.personasEnFoto.length > 0 && (
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-start gap-2">
                      <Users className="h-4 w-4 text-pabellon-green-600 mt-0.5" />
                      <div className="flex-1">
                        <div className="text-xs text-gray-500 mb-1">Personas en la foto</div>
                        <div className="text-sm text-gray-900">
                          {foto.personasEnFoto.join(", ")}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Keyboard Hints */}
            <div className="text-white text-sm mb-6 text-center opacity-60 sticky bottom-4">
              <span className="mr-4">ESC para salir del zoom</span>
              <span>Z para reducir</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
