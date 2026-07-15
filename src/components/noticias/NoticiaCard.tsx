import Link from "next/link";
import type { CategoriaNoticia, Noticia } from "@/data/noticias";
import { parseDateLocal } from "@/lib/date-utils";

/**
 * Etiquetas y estilos de insignia por categoría (PF-051).
 *
 * "en-memoria" usa tratamiento SOBRIO por mandato del spec §6:
 * insignia slate neutral, SIN acento dorado ni adornos.
 */
export const CATEGORIAS_NOTICIA: Record<
  CategoriaNoticia,
  { label: string; badgeClass: string }
> = {
  "en-memoria": {
    label: "En Memoria",
    badgeClass: "bg-slate-200 text-slate-700",
  },
  anuncio: {
    label: "Anuncio",
    badgeClass: "bg-pabellon-gold-100 text-pabellon-gold-800",
  },
  evento: {
    label: "Evento",
    badgeClass: "bg-pabellon-green-100 text-pabellon-green-800",
  },
  exaltacion: {
    label: "Exaltación",
    badgeClass: "bg-pabellon-gold-100 text-pabellon-gold-800",
  },
};

/**
 * Formatea una fecha ISO YYYY-MM-DD como "14 de julio de 2026" (es-PR),
 * usando parseDateLocal para evitar el desfase de zona horaria.
 */
export function formatearFechaNoticia(fecha: string): string {
  return parseDateLocal(fecha).toLocaleDateString("es-PR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

interface NoticiaCardProps {
  noticia: Noticia;
}

/**
 * Tarjeta compartida de noticia (lista /noticias + bloque de portada).
 * Server Component; toda la tarjeta enlaza al detalle con <Link>.
 */
export function NoticiaCard({ noticia }: NoticiaCardProps) {
  const { label, badgeClass } = CATEGORIAS_NOTICIA[noticia.categoria];
  const enMemoria = noticia.categoria === "en-memoria";

  return (
    <article
      className={`h-full bg-white rounded-lg shadow-md border transition-shadow duration-200 hover:shadow-lg ${
        enMemoria ? "border-slate-200" : "border-pabellon-gold-100"
      }`}
    >
      <Link href={`/noticias/${noticia.slug}`} className="block h-full p-6">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${badgeClass}`}
          >
            {label}
          </span>
          <time dateTime={noticia.fecha} className="text-sm text-gray-500">
            {formatearFechaNoticia(noticia.fecha)}
          </time>
        </div>

        <h3
          className={`text-xl font-bold mb-2 ${
            enMemoria ? "text-slate-800" : "text-pabellon-green-800"
          }`}
        >
          {noticia.titulo}
        </h3>

        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
          {noticia.resumen}
        </p>
      </Link>
    </article>
  );
}
