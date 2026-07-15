import Link from "next/link";
import { getUltimasNoticias } from "@/data/noticias";
import { NoticiaCard } from "@/components/noticias/NoticiaCard";

/**
 * Bloque "Últimas Noticias" de la portada (PF-051, DA).
 *
 * Muestra las 3 noticias más recientes en una cuadrícula de tarjetas,
 * con enlace a la lista completa en /noticias. Si no hay noticias
 * publicadas, no renderiza nada (patrón VisitasDistinguidas).
 */
export function UltimasNoticias() {
  const noticias = getUltimasNoticias(3);

  if (noticias.length === 0) return null;

  return (
    <section
      id="ultimas-noticias"
      className="scroll-mt-6 py-12 lg:py-16 bg-gray-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl lg:text-3xl font-bold text-pabellon-green-800 mb-4">
            Últimas Noticias
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Anuncios oficiales y novedades del Pabellón
          </p>
          <div className="mt-4 flex justify-center">
            <div className="w-24 h-1 bg-gradient-to-r from-pabellon-gold-400 to-pabellon-green-600 rounded-full"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {noticias.map((noticia) => (
            <NoticiaCard key={noticia.slug} noticia={noticia} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/noticias"
            className="inline-flex items-center font-semibold text-pabellon-green-700 hover:text-pabellon-green-800 transition-colors"
          >
            Ver todas las noticias →
          </Link>
        </div>
      </div>
    </section>
  );
}
