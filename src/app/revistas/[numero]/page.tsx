import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getRevistaByNumero, getAllRevistas } from "@/data/revistas";
import { getExaltadosPorRevista } from "@/data/exaltados-all";
import { ChevronLeft, Download, Calendar, Users, BookOpen } from "lucide-react";

interface RevistaPageProps {
  params: Promise<{
    numero: string;
  }>;
}

export async function generateStaticParams() {
  const revistas = getAllRevistas();
  return revistas.map((revista) => ({
    numero: revista.numero.toString(),
  }));
}

export async function generateMetadata({ params }: RevistaPageProps): Promise<Metadata> {
  const { numero } = await params;
  const numeroRevista = parseInt(numero);
  const revista = getRevistaByNumero(numeroRevista);

  if (!revista) {
    return {
      title: "Revista no encontrada | PFDH",
    };
  }

  return {
    title: `${revista.titulo} - Revista #${revista.numero} | PFDH`,
    description: `${revista.descripcion} - ${revista.exaltadosCount} exaltados en ${revista.year}`,
    keywords: [
      `Revista ${revista.numero}`,
      "Pabellón de la Fama",
      "Humacao",
      "Puerto Rico",
      `exaltación ${revista.year}`,
      "biografías",
    ],
  };
}

export default async function RevistaPage({ params }: RevistaPageProps) {
  const { numero } = await params;
  const numeroRevista = parseInt(numero);
  const revista = getRevistaByNumero(numeroRevista);

  if (!revista) {
    notFound();
  }

  const exaltados = getExaltadosPorRevista(numeroRevista);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with back button */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/revistas"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Volver a Revistas
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-pabellon-green-800 to-pabellon-green-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Portada */}
            <div className="lg:col-span-1">
              <div className="relative aspect-[3/4] max-w-sm mx-auto">
                <Image
                  src={revista.portadaUrl}
                  alt={`Portada ${revista.titulo}`}
                  fill
                  className="object-cover rounded-lg shadow-2xl"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  priority
                />
              </div>
            </div>

            {/* Info */}
            <div className="lg:col-span-2">
              <div className="inline-block px-4 py-1 bg-pabellon-gold-400 text-pabellon-green-900 rounded-full text-sm font-semibold mb-4">
                Revista #{revista.numero}
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                {revista.titulo}
              </h1>

              <p className="text-xl text-pabellon-green-100 mb-8">
                {revista.descripcion}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <Calendar className="w-6 h-6 mb-2 text-pabellon-gold-400" />
                  <div className="text-2xl font-bold">{revista.year}</div>
                  <div className="text-sm text-pabellon-green-200">Año</div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <Users className="w-6 h-6 mb-2 text-pabellon-gold-400" />
                  <div className="text-2xl font-bold">{revista.exaltadosCount}</div>
                  <div className="text-sm text-pabellon-green-200">Exaltados</div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <BookOpen className="w-6 h-6 mb-2 text-pabellon-gold-400" />
                  <div className="text-2xl font-bold">{revista.totalPaginas}</div>
                  <div className="text-sm text-pabellon-green-200">Páginas</div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <Calendar className="w-6 h-6 mb-2 text-pabellon-gold-400" />
                  <div className="text-sm font-bold">
                    {new Date(revista.fechaCeremonia).toLocaleDateString('es-PR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>
                  <div className="text-sm text-pabellon-green-200">Ceremonia</div>
                </div>
              </div>

              {/* Download PDF Button */}
              <a
                href={revista.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-pabellon-gold-400 text-pabellon-green-900 px-6 py-3 rounded-lg font-semibold hover:bg-pabellon-gold-300 transition-colors duration-200"
              >
                <Download className="w-5 h-5" />
                Descargar PDF Completo
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Categorías Overview */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 justify-center">
            {revista.categorias.deportistas > 0 && (
              <div className="text-center px-6 py-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-700">
                  {revista.categorias.deportistas}
                </div>
                <div className="text-sm text-blue-600">Atletas</div>
              </div>
            )}
            {revista.categorias.propulsores > 0 && (
              <div className="text-center px-6 py-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-700">
                  {revista.categorias.propulsores}
                </div>
                <div className="text-sm text-green-600">Propulsores</div>
              </div>
            )}
            {revista.categorias.postumos > 0 && (
              <div className="text-center px-6 py-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-700">
                  {revista.categorias.postumos}
                </div>
                <div className="text-sm text-purple-600">Póstumos</div>
              </div>
            )}
            {revista.categorias.comunicadores && revista.categorias.comunicadores > 0 && (
              <div className="text-center px-6 py-3 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-700">
                  {revista.categorias.comunicadores}
                </div>
                <div className="text-sm text-orange-600">Comunicadores</div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Exaltados Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-pabellon-green-800 mb-8 text-center">
            Exaltados de esta Revista
          </h2>

          {exaltados.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">
                Las biografías de esta revista estarán disponibles próximamente.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exaltados.map((exaltado) => (
                <Link
                  key={exaltado.id}
                  href={`/directorio/${exaltado.id}`}
                  className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-pabellon-green-800 group-hover:text-pabellon-green-600 transition-colors">
                          {exaltado.nombre}
                          {exaltado.apodo && (
                            <span className="text-pabellon-gold-600"> &quot;{exaltado.apodo}&quot;</span>
                          )}{" "}
                          {exaltado.apellidos}
                        </h3>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        {exaltado.deportes.join(", ")}
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800 capitalize">
                        {exaltado.categoria.toLowerCase()}
                      </span>
                    </div>

                    {exaltado.contenido.biografia && (
                      <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                        {exaltado.contenido.biografia}
                      </p>
                    )}

                    <div className="text-sm text-pabellon-green-600 font-medium group-hover:text-pabellon-green-700">
                      Ver biografía completa →
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
