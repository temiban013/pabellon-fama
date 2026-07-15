import type { NewsArticle, Organization, WithContext } from "schema-dts";
import type { Noticia } from "@/data/noticias";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://pabellon.org";

const organizacion: Organization = {
  "@type": "Organization",
  name: "Pabellón de la Fama del Deporte Humacaeño",
  url: baseUrl,
  logo: {
    "@type": "ImageObject",
    url: `${baseUrl}/images/pabellon-logo.png`,
  },
};

/**
 * JSON-LD NewsArticle para las páginas de detalle /noticias/[slug] (PF-051, D2).
 * Convención tipada de src/lib/schemas/ (modelado en event-schema.ts) —
 * NO extiende el switch legado de src/lib/seo.ts::generateJsonLd().
 */
export function generateNewsArticleSchema(
  noticia: Noticia
): WithContext<NewsArticle> {
  const urlNoticia = `${baseUrl}/noticias/${noticia.slug}`;

  // dateModified = fecha de la última actualización publicada, si existe.
  const dateModified =
    noticia.actualizaciones?.[noticia.actualizaciones.length - 1]?.fecha ??
    noticia.fecha;

  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: noticia.titulo,
    description: noticia.resumen,
    datePublished: noticia.fecha,
    dateModified,
    inLanguage: "es-PR",
    url: urlNoticia,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": urlNoticia,
    },
    articleBody: noticia.contenido.join("\n\n"),
    image: noticia.imagen ? [`${baseUrl}${noticia.imagen.src}`] : undefined,
    author: organizacion,
    publisher: organizacion,
  };
}
