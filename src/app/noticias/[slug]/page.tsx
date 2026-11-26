import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  getNoticiaBySlug,
  getNoticias,
  getRelacionadas,
  titularCompleto,
} from "@/data/noticias";
import {
  CATEGORIAS_NOTICIA,
  NoticiaCard,
  formatearFechaNoticia,
} from "@/components/noticias/NoticiaCard";
import { CuerpoNoticia } from "@/components/noticias/CuerpoNoticia";
import { generateNewsArticleSchema } from "@/lib/schemas/news-article-schema";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import { YouTubeEmbed } from "@/components/shared/YouTubeEmbed";
import { ExaltacionJsonLd } from "@/components/exaltacion/ExaltacionJsonLd";
import { EXALTACION_2026 } from "@/lib/data/exaltacion-2026";
import { getGaleria } from "@/data/galerias";
import { GaleriaNoticia } from "@/components/galeria/GaleriaNoticia";

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

  // PF-073: la imagen OG dedicada (1200×630) tiene prioridad sobre la principal.
  const imagenSocial = noticia.imagenOg ?? noticia.imagen;

  // Fechas con la hora de Puerto Rico (AST, UTC−4, sin horario de verano).
  const aFechaIso = (fecha: string) => `${fecha}T00:00:00-04:00`;
  const ultimaActualizacion = noticia.actualizaciones?.at(-1)?.fecha;

  return generateSEOMetadata({
    title: titularCompleto(noticia),
    // Al compartir, el titular va solo: el nombre del sitio ya sale aparte.
    socialTitle: titularCompleto(noticia),
    description: noticia.resumen,
    url: `/noticias/${noticia.slug}`,
    type: "article",
    article: {
      publishedTime: aFechaIso(noticia.fecha),
      ...(ultimaActualizacion
        ? { modifiedTime: aFechaIso(ultimaActualizacion) }
        : {}),
      ...(noticia.autor ? { authors: [noticia.autor.nombre] } : {}),
    },
    // Dimensiones y texto alternativo reales de la imagen que se comparte.
    ...(imagenSocial
      ? {
          image: imagenSocial.src,
          imageWidth: imagenSocial.width,
          imageHeight: imagenSocial.height,
          imageAlt: imagenSocial.alt,
        }
      : {}),
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
  const esNoticiaExaltacion = noticia.slug === EXALTACION_2026.noticiaSlug;
  const galeria = noticia.galeriaId ? getGaleria(noticia.galeriaId) : undefined;
  // PF-087: las noticias con cuerpo por bloques (crónicas) llevan tipografía
  // serif, subtítulo y firma.
  const esCronica = noticia.cuerpo !== undefined;
  const relacionadas = getRelacionadas(noticia);
  const haySigueLeyendo =
    relacionadas.length > 0 || (noticia.enlaces?.length ?? 0) > 0;
  // Imágenes verticales (p. ej. flyer 2:3): se contienen, NUNCA se recortan.
  const imagenVertical =
    noticia.imagen !== undefined &&
    noticia.imagen.height > noticia.imagen.width;

  return (
    <div
      className="min-h-screen bg-gray-50"
      // globals.css oculta el aviso global en la propia noticia de la Exaltación (PF-065).
      // Solo importa mientras AvisoExaltacion se renderiza (fase ≠ realizada): quitar junto con él.
      data-pagina={esNoticiaExaltacion ? "noticia-exaltacion" : undefined}
    >
      {/* Structured Data (NewsArticle) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(newsArticleJsonLd),
        }}
      />
      {esNoticiaExaltacion && <ExaltacionJsonLd />}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/noticias"
          className="inline-flex items-center text-pabellon-green-700 hover:text-pabellon-green-800 font-medium mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Noticias
        </Link>

        <article
          className={`bg-white rounded-lg shadow-md lg:p-10 ${
            // La crónica es larga: en teléfono gana ancho de lectura.
            esCronica ? "p-5 sm:p-8" : "p-8"
          }`}
        >
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

          {esCronica ? (
            <header className="mb-8">
              <h1 className="font-serif text-4xl leading-tight text-pabellon-green-800 lg:text-5xl">
                {noticia.titulo}
              </h1>
              {noticia.subtitulo && (
                <p className="mt-3 font-serif text-xl italic text-gray-600">
                  {noticia.subtitulo}
                </p>
              )}
              {noticia.autor && (
                <div className="mt-6">
                  <span
                    aria-hidden="true"
                    className="mb-3 block h-1 w-12 rounded bg-pabellon-gold-400"
                  />
                  <p className="text-base text-gray-800">
                    Por{" "}
                    <span className="font-semibold">{noticia.autor.nombre}</span>
                  </p>
                  {noticia.autor.descripcion && (
                    <p className="text-sm text-gray-500">
                      {noticia.autor.descripcion}
                    </p>
                  )}
                </div>
              )}
            </header>
          ) : (
            <h1
              className={`text-3xl lg:text-4xl font-bold mb-6 ${
                enMemoria ? "text-slate-800" : "text-pabellon-green-800"
              }`}
            >
              {noticia.titulo}
            </h1>
          )}

          {noticia.imagen && (
            <figure className="mb-8">
              <div className="overflow-hidden rounded-lg">
                <Image
                  src={noticia.imagen.src}
                  alt={noticia.imagen.alt}
                  width={noticia.imagen.width}
                  height={noticia.imagen.height}
                  className={
                    imagenVertical
                      ? "mx-auto h-auto max-h-[80vh] w-auto max-w-full object-contain"
                      : "w-full h-auto"
                  }
                  sizes={
                    imagenVertical
                      ? "(max-width: 768px) 100vw, 540px"
                      : "(max-width: 768px) 100vw, 720px"
                  }
                />
              </div>
              {noticia.imagen.credito && (
                <figcaption className="mt-2 text-sm italic text-gray-500">
                  Foto: {noticia.imagen.credito}
                </figcaption>
              )}
            </figure>
          )}

          {/* Cuerpo: nodos de texto — nunca HTML */}
          {noticia.cuerpo ? (
            <CuerpoNoticia bloques={noticia.cuerpo} />
          ) : (
            <div className="space-y-4">
              {(noticia.contenido ?? []).map((parrafo, index) => (
                <p key={index} className="text-lg text-gray-700 leading-relaxed">
                  {parrafo}
                </p>
              ))}
            </div>
          )}

          {noticia.youtubeId && (
            <YouTubeEmbed
              youtubeId={noticia.youtubeId}
              title={noticia.titulo}
              credito={noticia.youtubeCredito}
              className="mt-8"
            />
          )}

          {galeria && <GaleriaNoticia galeria={galeria} />}

          {noticia.videos && noticia.videos.length > 0 && (
            <section
              aria-labelledby="videos-titulo"
              className="mt-10 border-t border-gray-200 pt-8"
            >
              <h2
                id="videos-titulo"
                className="mb-4 text-2xl font-bold text-pabellon-green-800"
              >
                Momentos en video
              </h2>
              <ul className="grid gap-6 sm:grid-cols-2">
                {noticia.videos.map((video) => (
                  <li key={video.youtubeId}>
                    <YouTubeEmbed
                      youtubeId={video.youtubeId}
                      title={video.titulo}
                    />
                    <p className="mt-2 text-sm font-medium text-gray-700">
                      {video.titulo}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          )}

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

        {haySigueLeyendo && (
          <section aria-labelledby="sigue-leyendo-titulo" className="mt-10">
            <h2
              id="sigue-leyendo-titulo"
              className="mb-4 text-2xl font-bold text-pabellon-green-800"
            >
              Sigue leyendo
            </h2>
            <div className="grid gap-6">
              {relacionadas.map((relacionada) => (
                <NoticiaCard key={relacionada.slug} noticia={relacionada} />
              ))}
            </div>
            {noticia.enlaces && noticia.enlaces.length > 0 && (
              <ul className="mt-5 space-y-2">
                {noticia.enlaces.map((enlace) => (
                  <li key={enlace.href}>
                    <Link
                      href={enlace.href}
                      className="font-medium text-pabellon-green-700 underline underline-offset-4 hover:text-pabellon-green-800"
                    >
                      {enlace.texto} <span aria-hidden="true">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
