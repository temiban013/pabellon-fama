import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAllRevistas } from "@/data/revistas";

export const metadata: Metadata = {
  title: "Revistas del Pabellón | Pabellón de la Fama del Deporte Humacaeño",
  description:
    "Explora todas las revistas conmemorativas del Pabellón de la Fama del Deporte Humacaeño. Lee biografías completas de los exaltados.",
  keywords: [
    "Revistas PFDH",
    "Pabellón de la Fama",
    "Humacao",
    "Puerto Rico",
    "exaltados",
    "biografías",
    "historia deportiva",
  ],
};

export default function RevistasPage() {
  const revistas = getAllRevistas();

  return (
    <div className="min-h-screen bg-gradient-to-b from-pabellon-green-50 to-white">
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 bg-gradient-to-br from-pabellon-brown-50 via-white to-pabellon-gold-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-pabellon-green-800 mb-4">
              Revistas del Pabellón
            </h1>
            <p className="text-lg lg:text-xl text-pabellon-gold-600 font-medium max-w-3xl mx-auto">
              Explora las revistas conmemorativas de cada exaltación. Lee biografías completas,
              logros y la historia de nuestros exaltados.
            </p>
            <div className="mt-6 flex justify-center">
              <div className="w-32 h-1 bg-gradient-to-r from-pabellon-gold-400 to-pabellon-brown-600 rounded-full"></div>
            </div>
          </div>

          {revistas.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">
                Las revistas digitalizadas estarán disponibles próximamente.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Revistas Grid */}
      {revistas.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {revistas.map((revista) => (
                <Link
                  key={revista.numero}
                  href={`/revistas/${revista.numero}`}
                  className="group"
                >
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                    {/* Portada */}
                    <div className="relative aspect-[3/4] bg-gray-100">
                      <Image
                        src={revista.portadaUrl}
                        alt={`Portada Revista ${revista.numero} - ${revista.titulo}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <p className="text-sm font-medium">Ver biografías completas →</p>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-pabellon-gold-100 text-pabellon-gold-800">
                          Revista #{revista.numero}
                        </span>
                        <span className="text-sm font-medium text-pabellon-green-700">
                          {revista.year}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-pabellon-green-800 mb-2 group-hover:text-pabellon-green-600 transition-colors">
                        {revista.titulo}
                      </h3>

                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {revista.descripcion}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="text-sm text-gray-600">
                          <span className="font-semibold text-pabellon-green-700">
                            {revista.exaltadosCount}
                          </span>{" "}
                          exaltados
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-semibold text-pabellon-green-700">
                            {revista.totalPaginas}
                          </span>{" "}
                          páginas
                        </div>
                      </div>

                      {/* Categorías */}
                      <div className="mt-4 flex flex-wrap gap-2">
                        {revista.categorias.deportistas > 0 && (
                          <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded">
                            {revista.categorias.deportistas} Atletas
                          </span>
                        )}
                        {revista.categorias.propulsores > 0 && (
                          <span className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded">
                            {revista.categorias.propulsores} Propulsores
                          </span>
                        )}
                        {revista.categorias.postumos > 0 && (
                          <span className="text-xs px-2 py-1 bg-purple-50 text-purple-700 rounded">
                            {revista.categorias.postumos} Póstumos
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-pabellon-green-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            ¿Buscas un exaltado específico?
          </h2>
          <p className="text-lg text-pabellon-green-200 mb-8">
            Visita nuestro directorio completo para explorar todos los exaltados al Pabellón de la Fama.
          </p>
          <Link
            href="/directorio"
            className="inline-block bg-pabellon-gold-400 text-pabellon-green-900 px-8 py-3 rounded-lg font-semibold hover:bg-pabellon-gold-300 transition-colors duration-200"
          >
            Ver Directorio Completo
          </Link>
        </div>
      </section>
    </div>
  );
}
