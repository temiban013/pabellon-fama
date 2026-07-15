import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getNoticiaBySlug, getNoticias } from "@/data/noticias";
import {
  CATEGORIAS_NOTICIA,
  formatearFechaNoticia,
} from "@/components/noticias/NoticiaCard";
import { generateNewsArticleSchema } from "@/lib/schemas/news-article-schema";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";

interface NoticiaPageProps {
  params: Promise<{ slug: string }>;
}

// SSG: una página estática por noticia publicada
export function generateStaticParams() {
  return getNoticias().map((noticia) => ({
    slug: noticia.slug,
  }));
}

export async function generateMetadata({
  params,
}: NoticiaPageProps): Promise<Metadata> {
  const { slug } = await params;
  const noticia = getNoticiaBySlug(slug);

  if (!noticia) {
    return {
      title: "Noticia no encontrada",
      description: "La noticia solicitada no fue encontrada.",
    };
  }

  return generateSEOMetadata({
    title: noticia.titulo,
    description: noticia.resumen,
    url: `/noticias/${noticia.slug}`,
    type: "article",
    ...(noticia.imagen ? { image: noticia.imagen.src } : {}),
  });
}

export default async function NoticiaPage({ params }: NoticiaPageProps) {
  const { slug } = await params;
  const noticia = getNoticiaBySlug(slug);

  if (!noticia) {
    notFound();
  }

  const { label, badgeClass } = CATEGORIAS_NOTICIA[noticia.categoria];
  const enMemoria = noticia.categoria === "en-memoria";
  const newsArticleJsonLd = generateNewsArticleSchema(noticia);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Structured Data (NewsArticle) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(newsArticleJsonLd),
        }}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/noticias"
          className="inline-flex items-center text-pabellon-green-700 hover:text-pabellon-green-800 font-medium mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Noticias
        </Link>

        <article className="bg-white rounded-lg shadow-md p-8 lg:p-10">
          {/* Insignias: categoría + fecha */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${badgeClass}`}
            >
              {label}
            </span>
            <time
              dateTime={noticia.fecha}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700"
            >
              {formatearFechaNoticia(noticia.fecha)}
            </time>
          </div>

          <h1
            className={`text-3xl lg:text-4xl font-bold mb-6 ${
              enMemoria ? "text-slate-800" : "text-pabellon-green-800"
            }`}
          >
            {noticia.titulo}
          </h1>

          {noticia.imagen && (
            <div className="mb-8 overflow-hidden rounded-lg">
              <Image
                src={noticia.imagen.src}
                alt={noticia.imagen.alt}
                width={noticia.imagen.width}
                height={noticia.imagen.height}
                className="w-full h-auto"
                sizes="(max-width: 768px) 100vw, 720px"
              />
            </div>
          )}

          {/* Cuerpo: párrafos como nodos de texto — nunca HTML */}
          <div className="space-y-4">
            {noticia.contenido.map((parrafo, index) => (
              <p key={index} className="text-lg text-gray-700 leading-relaxed">
                {parrafo}
              </p>
            ))}
          </div>

          {noticia.actualizaciones && noticia.actualizaciones.length > 0 && (
            <section className="mt-8 border-t border-gray-200 pt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Actualizaciones
              </h2>
              <ul className="space-y-3">
                {noticia.actualizaciones.map((actualizacion, index) => (
                  <li key={index} className="text-gray-700 leading-relaxed">
                    <time
                      dateTime={actualizacion.fecha}
                      className="font-semibold text-gray-900"
                    >
                      {formatearFechaNoticia(actualizacion.fecha)}:
                    </time>{" "}
                    {actualizacion.texto}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {noticia.exaltadoSlug && (
            <div className="mt-8 border-t border-gray-200 pt-6">
              <Link
                href={`/directorio/${noticia.exaltadoSlug}`}
                className={`inline-flex items-center font-medium transition-colors ${
                  enMemoria
                    ? "text-slate-700 hover:text-slate-900 underline underline-offset-4"
                    : "text-pabellon-green-700 hover:text-pabellon-green-800"
                }`}
              >
                Ver su perfil en el Directorio de Exaltados →
              </Link>
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
