/**
 * Metadatos y datos estructurados de las páginas de revistas.
 *
 * La portada de cada revista es la imagen que se comparte (Open Graph), para
 * que el enlace a `/revistas/<slug>` muestre la portada en WhatsApp y redes.
 */
import { join } from "node:path";
import type { Metadata } from "next";
import sharp from "sharp";
import { SITE_URL } from "@/lib/constants/site";
import { generateBreadcrumbs, generateMetadata as generateSEOMetadata } from "@/lib/seo";
import type { RevistaMetadata } from "@/lib/types/revista";

const NOMBRE_ORGANIZACION = "Pabellón de la Fama del Deporte Humacaeño";

export interface DimensionesImagen {
  width: number;
  height: number;
}

/**
 * Lee el ancho y alto reales de una portada bajo `public/`. Devuelve
 * `undefined` si el archivo no se puede leer: la página se publica igual,
 * solo sin `og:image:width`/`og:image:height`.
 */
export async function dimensionesPortada(
  portadaUrl: string,
): Promise<DimensionesImagen | undefined> {
  try {
    const { width, height } = await sharp(join(process.cwd(), "public", portadaUrl)).metadata();
    return width && height ? { width, height } : undefined;
  } catch {
    return undefined;
  }
}

export function tituloRevista(revista: RevistaMetadata): string {
  return revista.tipo === "especial"
    ? `${revista.titulo} (${revista.year}) – Edición Especial`
    : `${revista.titulo} (${revista.year}) – Revista #${revista.numero}`;
}

export function metadataRevista(
  revista: RevistaMetadata,
  dimensiones?: DimensionesImagen,
): Metadata {
  const keywords =
    revista.tipo === "especial"
      ? ["Edición Especial", "Museo", `inauguración ${revista.year}`, "revista"]
      : [
          `Revista ${revista.numero}`,
          `exaltación ${revista.year}`,
          `Cuadro de Honor ${revista.year}`,
          "biografías",
          "revista",
        ];

  return generateSEOMetadata({
    title: tituloRevista(revista),
    description: revista.descripcion,
    keywords,
    url: `/revistas/${revista.slug}`,
    type: "article",
    image: `${SITE_URL}${revista.portadaUrl}`,
    imageAlt: `Portada de la revista: ${revista.titulo} (${revista.year})`,
    ...(dimensiones
      ? { imageWidth: dimensiones.width, imageHeight: dimensiones.height }
      : {}),
  });
}

/** JSON-LD de la revista (PublicationIssue) y su ruta de navegación. */
export function jsonLdRevista(revista: RevistaMetadata): Record<string, unknown>[] {
  const url = `${SITE_URL}/revistas/${revista.slug}`;
  const fecha = revista.fechaCeremonia ?? revista.fechaEvento;

  const publicacion: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "PublicationIssue",
    "@id": url,
    url,
    name: tituloRevista(revista),
    description: revista.descripcion,
    inLanguage: "es",
    image: `${SITE_URL}${revista.portadaUrl}`,
    ...(revista.numero !== undefined ? { issueNumber: revista.numero } : {}),
    ...(fecha ? { datePublished: fecha } : {}),
    pagination: `1-${revista.totalPaginas}`,
    isPartOf: {
      "@type": "Periodical",
      name: `Revistas del ${NOMBRE_ORGANIZACION}`,
      url: `${SITE_URL}/revistas`,
    },
    publisher: {
      "@type": "Organization",
      name: NOMBRE_ORGANIZACION,
      url: SITE_URL,
    },
    encoding: {
      "@type": "MediaObject",
      encodingFormat: "application/pdf",
      contentUrl: revista.pdfUrl,
    },
  };

  const ruta = generateBreadcrumbs([
    { name: "Inicio", url: SITE_URL },
    { name: "Revistas", url: `${SITE_URL}/revistas` },
    { name: revista.titulo, url },
  ]);

  return [publicacion, ruta];
}
