"use client";

import Link from "next/link";
import Image from "next/image";
import { type Exaltado } from "@/lib/types";
import { getInitials, capitalize } from "@/lib/utils";

// Mapeo para mostrar nombres más descriptivos de categorías
const categoriasLabels: Record<string, string> = {
  atleta: "Atleta",
  jugador: "Jugador",
  boxeador: "Boxeador", 
  propulsor: "Propulsor",
  cronista: "Cronista Deportivo",
  equipo: "Equipo",
  promotor: "Promotor",
  dirigente: "Dirigente",
  entrenador: "Entrenador",
  arbitro: "Árbitro",
  comentarista: "Comentarista",
  benefactor: "Benefactor",
  "atleta-propulsor": "Atleta-Propulsor",
  "jugador-propulsor": "Jugador-Propulsor",
};

interface ExaltadoCardProps {
  exaltado: Exaltado;
  viewMode: "grid" | "list";
  className?: string;
}

export function ExaltadoCard({
  exaltado,
  viewMode,
  className = "",
}: ExaltadoCardProps) {
  // Para equipos, usar un ícono diferente en lugar de iniciales
  const isTeam = exaltado.categoria === "equipo";
  const initials = isTeam ? "⚾" : getInitials(exaltado.nombre);

  // Función para obtener el nombre completo con apodo
  const getFullName = () => {
    // Use nombreCompleto field which already has the correct full name
    // to avoid duplication issues when nombre contains the full name
    if (exaltado.apodo) {
      // Insert apodo into nombreCompleto
      // nombreCompleto has the format "FirstName LastName"
      const parts = exaltado.nombreCompleto.split(' ');
      if (parts.length >= 2) {
        // Insert apodo after first name
        return `${parts[0]} "${exaltado.apodo}" ${parts.slice(1).join(' ')}`;
      }
      // Fallback if name format is unexpected
      return `${exaltado.nombreCompleto} "${exaltado.apodo}"`;
    }
    return exaltado.nombreCompleto;
  };

  // Función para obtener color de categoría
  const getCategoryColor = (categoria: string) => {
    const colors = {
      atleta: "bg-blue-100 text-blue-800",
      jugador: "bg-green-100 text-green-800",
      propulsor: "bg-purple-100 text-purple-800",
      entrenador: "bg-orange-100 text-orange-800",
      arbitro: "bg-yellow-100 text-yellow-800",
      cronista: "bg-indigo-100 text-indigo-800",
      equipo: "bg-red-100 text-red-800",
      boxeador: "bg-red-100 text-red-800",
      "atleta-propulsor": "bg-teal-100 text-teal-800",
      "jugador-propulsor": "bg-cyan-100 text-cyan-800",
    };
    return (
      colors[categoria as keyof typeof colors] || "bg-gray-100 text-gray-800"
    );
  };

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

  if (viewMode === "list") {
    return (
      <Link
        href={`/directorio/${exaltado.id}`}
        className={`card-pabellon p-4 cursor-pointer hover:shadow-pabellon-lg transition-all duration-200 hover:scale-[1.02] block ${className}`}
      >
        <div className="flex items-center space-x-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-pabellon-gold-300">
              {exaltado.foto ? (
                <Image
                  src={exaltado.foto}
                  alt={`Foto de ${exaltado.nombre}`}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-pabellon-gold-400 to-pabellon-gold-600 flex items-center justify-center text-white font-bold text-lg">
                  {initials}
                </div>
              )}
            </div>
          </div>

          {/* Información principal */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-pabellon-green-800 truncate">
              {getFullName()}
            </h3>

            <div className="flex flex-wrap items-center gap-2 mt-1">
              {exaltado.deporte.map((deporte, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 text-sm font-medium text-pabellon-green-600"
                >
                  <span className="text-lg">{getSportEmoji(deporte)}</span>
                  {deporte}
                </span>
              ))}
            </div>

            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {exaltado.biografia}
            </p>
          </div>

          {/* Información secundaria */}
          <div className="flex-shrink-0 text-right">
            <div
              className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                exaltado.categoria
              )}`}
            >
              {categoriasLabels[exaltado.categoria] || capitalize(exaltado.categoria)}
            </div>
            <div className="text-sm font-medium text-pabellon-gold-600">
              {exaltado.anoExaltacion}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Vista grid (por defecto)
  return (
    <Link
      href={`/directorio/${exaltado.id}`}
      className={`card-pabellon group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-pabellon-lg block ${className}`}
    >
      {/* Imagen/Avatar */}
      <div className="relative h-48 bg-gradient-to-br from-pabellon-green-50 to-pabellon-gold-50 rounded-t-lg overflow-hidden">
        {exaltado.foto ? (
          <Image
            src={exaltado.foto}
            alt={`Foto de ${exaltado.nombre}`}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pabellon-gold-400 to-pabellon-gold-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
              {initials}
            </div>
          </div>
        )}

        {/* Overlay con categoría */}
        <div className="absolute top-4 left-4">
          <span
            className={`inline-flex px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${getCategoryColor(
              exaltado.categoria
            )}`}
          >
            {categoriasLabels[exaltado.categoria] || capitalize(exaltado.categoria)}
          </span>
        </div>

        {/* Año de exaltación */}
        <div className="absolute top-4 right-4">
          <span className="bg-pabellon-green-800 bg-opacity-90 text-white px-2 py-1 rounded-full text-xs font-bold backdrop-blur-sm">
            {exaltado.anoExaltacion}
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-pabellon-green-800 mb-2 line-clamp-2">
          {getFullName()}
        </h3>

        {/* Deportes */}
        <div className="flex flex-wrap gap-1 mb-3">
          {exaltado.deporte.map((deporte, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 bg-pabellon-gold-100 text-pabellon-gold-800 px-2 py-1 rounded-md text-sm font-medium"
            >
              <span className="text-base">{getSportEmoji(deporte)}</span>
              {deporte}
            </span>
          ))}
        </div>

        {/* Biografía */}
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
          {exaltado.biografia}
        </p>

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <span className="text-sm text-pabellon-green-600 font-medium">
            Año {exaltado.anoExaltacion}
          </span>
          <span className="text-pabellon-gold-600 hover:text-pabellon-gold-700 font-medium text-sm transition-colors">
            Ver detalles →
          </span>
        </div>
      </div>
    </Link>
  );
}
