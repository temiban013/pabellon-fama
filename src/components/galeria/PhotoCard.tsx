"use client";

import Image from "next/image";
import { FotoHistorica } from "@/lib/types/revista";
import { Calendar, BookOpen, Trophy, ZoomIn } from "lucide-react";

interface PhotoCardProps {
  foto: FotoHistorica;
  onClick: () => void;
}

export function PhotoCard({ foto, onClick }: PhotoCardProps) {
  return (
    <div
      onClick={onClick}
      className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
        <Image
          src={foto.archivoUrl}
          alt={foto.titulo}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Zoom Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
            <div className="bg-white rounded-full p-3 shadow-lg">
              <ZoomIn className="h-6 w-6 text-pabellon-green-700" />
            </div>
          </div>
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 right-3">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-lg ${
            foto.categoria === "equipo"
              ? "bg-blue-500 text-white"
              : foto.categoria === "evento"
              ? "bg-green-500 text-white"
              : foto.categoria === "persona"
              ? "bg-purple-500 text-white"
              : foto.categoria === "ceremonia"
              ? "bg-orange-500 text-white"
              : "bg-gray-500 text-white"
          }`}>
            {foto.categoria === "equipo" && "Equipo"}
            {foto.categoria === "evento" && "Evento"}
            {foto.categoria === "persona" && "Persona"}
            {foto.categoria === "ceremonia" && "Ceremonia"}
            {foto.categoria === "instalacion" && "Instalación"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-pabellon-green-700 transition-colors">
          {foto.titulo}
        </h3>

        {foto.descripcion && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {foto.descripcion}
          </p>
        )}

        {/* Metadata */}
        <div className="flex flex-wrap gap-3 text-xs text-gray-500">
          {foto.año && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>{foto.año}</span>
            </div>
          )}

          <div className="flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Revista #{foto.revistaOrigen}</span>
          </div>

          {foto.deporteRelacionado && (
            <div className="flex items-center gap-1">
              <Trophy className="h-3.5 w-3.5" />
              <span>{foto.deporteRelacionado}</span>
            </div>
          )}
        </div>

        {/* People in Photo */}
        {foto.personasEnFoto && foto.personasEnFoto.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              <span className="font-semibold">Personas:</span>{" "}
              {foto.personasEnFoto.slice(0, 3).join(", ")}
              {foto.personasEnFoto.length > 3 && ` y ${foto.personasEnFoto.length - 3} más`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
