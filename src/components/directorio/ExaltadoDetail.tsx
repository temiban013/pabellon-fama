"use client";

import Link from "next/link";
import { type Exaltado } from "@/lib/types";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { ShareButtons } from "@/components/shared/ShareButtons";
import { ExaltadoDetailLayout } from "@/components/shared/ExaltadoDetailLayout";

interface ExaltadoDetailProps {
  exaltado: {
    id: string;
    nombre: string;
    apellidos?: string;
    nombreCompleto: string;
    name: string;
    deporte: string[];
    sport: string;
    categoria: string;
    anoExaltacion: number;
    yearInducted: number;
    exaltacion?: string;
    biografia: string;
    biography: string;
    foto?: string;
    photo?: string;
    fechaNacimiento?: string | null;
    fechaFallecimiento?: string | null;
    lugarNacimiento?: string | null;
    apodo?: string | null;
    logros?: string[];
    achievements?: string[];
    reconocimientos?: string[];
    estado: "activo" | "fallecido";
    slug: string;
  };
}

/**
 * Full page component for exaltado details
 * Sprint 10 - SEO & Navigation Unification
 * Uses shared ExaltadoDetailLayout matching modal design
 */
export function ExaltadoDetail({ exaltado }: ExaltadoDetailProps) {
  const displayName = exaltado.nombreCompleto || exaltado.name;
  const firstName = exaltado.nombre || displayName.split(" ")[0];

  // Convert hybrid data structure to Exaltado type
  const exaltadoData: Exaltado = {
    id: exaltado.id,
    nombre: firstName,
    apellidos: exaltado.apellidos || displayName.split(" ").slice(1).join(" "),
    nombreCompleto: displayName,
    deporte: exaltado.deporte || [exaltado.sport],
    categoria: exaltado.categoria as Exaltado["categoria"],
    anoExaltacion: exaltado.anoExaltacion || exaltado.yearInducted,
    exaltacion: exaltado.exaltacion,
    biografia: exaltado.biografia || exaltado.biography,
    logros: exaltado.logros || exaltado.achievements || [],
    reconocimientos: exaltado.reconocimientos || [],
    foto: exaltado.foto || exaltado.photo,
    estado: exaltado.estado,
    fechaNacimiento: exaltado.fechaNacimiento ?? undefined,
    fechaFallecimiento: exaltado.fechaFallecimiento ?? undefined,
    lugarNacimiento: exaltado.lugarNacimiento ?? undefined,
    apodo: exaltado.apodo ?? undefined,
  };

  // Breadcrumb navigation
  const breadcrumbItems = [
    { label: "Directorio", href: "/directorio" },
    { label: displayName },
  ];

  // Share data
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://pabellon.org";
  const currentUrl = `${baseUrl}/directorio/${exaltado.slug}`;

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
    <div className="min-h-screen bg-gray-50">
      {/* Header with green gradient matching modal */}
      <div className="bg-gradient-to-r from-pabellon-green-800 to-pabellon-green-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <Breadcrumbs items={breadcrumbItems} variant="light" />

          <div className="mt-4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3">
              {displayName}
            </h1>
            <div className="flex flex-wrap items-center gap-2">
              {exaltadoData.deporte.map((deporte, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 sm:gap-2 bg-white bg-opacity-20 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-sm sm:text-base font-medium"
                >
                  <span className="text-lg sm:text-xl">
                    {getSportEmoji(deporte)}
                  </span>
                  <span className="hidden sm:inline">{deporte}</span>
                  <span className="sm:hidden">{deporte.split(" ")[0]}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Share buttons */}
        <div className="mb-6">
          <ShareButtons
            title={displayName}
            url={currentUrl}
            description={`${displayName}, exaltado al Pabellón de la Fama del Deporte Humacaeño en ${exaltadoData.anoExaltacion}`}
          />
        </div>

        {/* Exaltado details using shared layout */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-4 sm:p-6 lg:p-8">
            <ExaltadoDetailLayout exaltado={exaltadoData} />
          </div>
        </div>

        {/* Back to directory link */}
        <div className="mt-6 sm:mt-8 text-center">
          <Link
            href="/directorio"
            className="inline-flex items-center text-pabellon-green-600 hover:text-pabellon-green-800 font-medium transition-colors"
          >
            ← Volver al Directorio
          </Link>
        </div>
      </div>
    </div>
  );
}