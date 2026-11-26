import { SITE_URL } from "@/lib/constants/site";
import type { NewsArticle, Organization, WithContext } from "schema-dts";
import {
  parrafosDeNoticia,
  titularCompleto,
  type Noticia,
} from "@/data/noticias";


const organizacion: Organization = {
  "@type": "Organization",
  name: "Pabellón de la Fama del Deporte Humacaeño",
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/images/pabellon-logo.png`,
  },
};

/** Las imágenes locales llevan el dominio del sitio; las de Blob ya son absolutas. */
const urlAbsoluta = (src: string): string =>
  src.startsWith("https://") ? src : `${SITE_URL}${src}`;

/**
 * JSON-LD NewsArticle para las páginas de detalle /noticias/[slug] (PF-051, D2).
 * Convención tipada de src/lib/schemas/ (modelado en event-schema.ts) —
 * NO extiende el switch legado de src/lib/seo.ts::generateJsonLd().
 */
export function generateNewsArticleSchema(
  noticia: Noticia
): WithContext<NewsArticle> {
  const urlNoticia = `${SITE_URL}/noticias/${noticia.slug}`;

  // dateModified = fecha de la última actualización publicada, si existe.
  const dateModified =
    noticia.actualizaciones?.[noticia.actualizaciones.length - 1]?.fecha ??
    noticia.fecha;

  // PF-087: perfiles de los exaltados que el cuerpo presenta en tarjetas. El
  // `@id` es el mismo del `Person` de cada perfil (src/lib/directorio/seo.ts).
  const mentions = (noticia.cuerpo ?? []).flatMap((bloque) =>
    bloque.tipo === "exaltados"
      ? bloque.items.map((item) => ({
          "@id": `${SITE_URL}/directorio/${item.exaltadoId}`,
        }))
      : []
  );

  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: titularCompleto(noticia),
    ...(noticia.subtitulo ? { alternativeHeadline: noticia.subtitulo } : {}),
    description: noticia.resumen,
    datePublished: noticia.fecha,
    dateModified,
    inLanguage: "es-PR",
    url: urlNoticia,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": urlNoticia,
    },
    articleBody: parrafosDeNoticia(noticia).join("\n\n"),
    image: noticia.imagen ? [urlAbsoluta(noticia.imagen.src)] : undefined,
    // Texto firmado: el autor es la persona; si no, firma el Pabellón.
    author: noticia.autor
      ? { "@type": "Person", name: noticia.autor.nombre }
      : organizacion,
    ...(mentions.length > 0 ? { mentions } : {}),
    publisher: organizacion,
  };
}
