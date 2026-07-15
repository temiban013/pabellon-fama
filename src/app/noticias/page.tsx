import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Newspaper } from "lucide-react";
import { getNoticias } from "@/data/noticias";
import { NoticiaCard } from "@/components/noticias/NoticiaCard";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";

export const metadata: Metadata = generateSEOMetadata({
  title: "Noticias del Pabellón",
  description:
    "Noticias y anuncios oficiales del Pabellón de la Fama del Deporte Humacaeño: comunicados de la Junta, eventos, exaltaciones y notas en memoria.",
  keywords: ["noticias", "anuncios", "comunicados", "en memoria"],
  url: "/noticias",
});

export default function NoticiasPage() {
  const noticias = getNoticias();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center text-blue-200 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Inicio
          </Link>

          <div className="flex items-center mb-4">
            <Newspaper className="h-8 w-8 mr-3" />
            <h1 className="text-4xl font-bold">Noticias del Pabellón</h1>
          </div>

          <p className="text-xl text-blue-100 max-w-3xl">
            Anuncios oficiales y novedades del Pabellón de la Fama del Deporte
            Humacaeño.
          </p>
        </div>
      </div>

      {/* Lista de noticias (orden cronológico inverso) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {noticias.length === 0 ? (
          <p className="text-center text-xl text-gray-600 py-12">
            No hay noticias publicadas por el momento.
          </p>
        ) : (
          <div className="max-w-3xl mx-auto space-y-6">
            {noticias.map((noticia) => (
              <NoticiaCard key={noticia.slug} noticia={noticia} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
