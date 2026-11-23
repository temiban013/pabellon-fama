/**
 * Metadatos y datos estructurados de los perfiles de exaltados
 * (`/directorio/<id>`).
 *
 * La foto del exaltado es la imagen que se comparte (Open Graph), para que el
 * enlace al perfil muestre a la persona en WhatsApp y redes.
 */
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants/site";
import type { DimensionesImagen } from "@/lib/imagen-publica";
import { generateBreadcrumbs, generateMetadata as generateSEOMetadata } from "@/lib/seo";
import type { ExaltadoRevista } from "@/lib/types/revista";

const NOMBRE_ORGANIZACION = "Pabellón de la Fama del Deporte Humacaeño";

/** Largo máximo de la descripción: lo que cabe en un resultado de búsqueda. */
export const LARGO_MAXIMO_DESCRIPCION = 155;

/**
 * Lado mínimo (px) para usar la foto como imagen al compartir. Por debajo, las
 * redes la descartan y es mejor la imagen por defecto del sitio.
 */
export const LADO_MINIMO_IMAGEN_SOCIAL = 200;

type ExaltadoSeo = Pick<
  ExaltadoRevista,
  | "id"
  | "nombre"
  | "apodo"
  | "apellidos"
  | "categoria"
  | "deportes"
  | "anoExaltacion"
  | "foto"
  | "fechaFallecimiento"
  | "contenido"
>;

/** Nombre sin apodo: «Víctor M. Hernández López». */
export function nombreExaltado(exaltado: ExaltadoSeo): string {
  return `${exaltado.nombre} ${exaltado.apellidos}`.trim();
}

/** Nombre con apodo: «Víctor M. "Vitín" Hernández López». */
export function nombreCompletoExaltado(exaltado: ExaltadoSeo): string {
  const apodo = exaltado.apodo ? ` "${exaltado.apodo}"` : "";
  return `${exaltado.nombre}${apodo} ${exaltado.apellidos}`.trim();
}

/** Un punto tras una inicial («Luis H.») o una abreviatura («Dr.») no cierra la oración. */
const NO_CIERRA_ORACION =
  /(?:^|[\s(«"])(?:[A-ZÁÉÍÓÚÑ]|Sr|Sra|Srta|Dr|Dra|Prof|Lcdo|Lcda|Ing|Hon|Rvdo|Tnte|Sgto|Cap|Cnel|Gral|etc|pág|núm|Jr|Ave|Bo|Urb)\.$/;

/** Divide un texto en oraciones, sin partir en iniciales ni abreviaturas. */
export function separarOraciones(texto: string): string[] {
  const piezas = texto
    .replace(/\s+/g, " ")
    .trim()
    .split(/(?<=[.!?])\s+/);

  const oraciones: string[] = [];
  for (const pieza of piezas) {
    const anterior = oraciones.at(-1);
    if (anterior !== undefined && NO_CIERRA_ORACION.test(anterior)) {
      oraciones[oraciones.length - 1] = `${anterior} ${pieza}`;
    } else {
      oraciones.push(pieza);
    }
  }
  return oraciones;
}

/**
 * Descripción de hasta 155 caracteres: quién es y cuándo fue exaltado, más las
 * primeras oraciones completas de la biografía que quepan. Nunca corta una
 * palabra: si la primera oración no cabe entera, se recorta en un espacio y
 * termina en «…».
 */
export function descripcionExaltado(exaltado: ExaltadoSeo): string {
  const base = `${nombreCompletoExaltado(exaltado)}, exaltado al ${NOMBRE_ORGANIZACION} en ${exaltado.anoExaltacion}. ${exaltado.deportes.join(", ")}.`;
  const oraciones = separarOraciones(exaltado.contenido.biografia);

  let descripcion = base;
  for (const oracion of oraciones) {
    const candidata = `${descripcion} ${oracion}`;
    if (candidata.length > LARGO_MAXIMO_DESCRIPCION) break;
    descripcion = candidata;
  }

  if (descripcion === base && oraciones[0]) {
    const espacio = LARGO_MAXIMO_DESCRIPCION - base.length - 2; // espacio y «…»
    if (espacio >= 20) {
      const recorte = oraciones[0].slice(0, espacio + 1);
      const corte = recorte.lastIndexOf(" ");
      if (corte >= 20) {
        descripcion = `${base} ${recorte.slice(0, corte).replace(/[,;:]$/, "")}…`;
      }
    }
  }

  return descripcion;
}

/** `true` si la foto tiene tamaño suficiente para usarse al compartir. */
export function sirveComoImagenSocial(dimensiones?: DimensionesImagen): boolean {
  return (
    !!dimensiones &&
    dimensiones.width >= LADO_MINIMO_IMAGEN_SOCIAL &&
    dimensiones.height >= LADO_MINIMO_IMAGEN_SOCIAL
  );
}

export function metadataExaltado(
  exaltado: ExaltadoSeo,
  dimensionesFoto?: DimensionesImagen,
): Metadata {
  const nombreCompleto = nombreCompletoExaltado(exaltado);
  const esEquipo = exaltado.categoria === "EQUIPO";
  const fotoSocial =
    exaltado.foto && dimensionesFoto && sirveComoImagenSocial(dimensionesFoto)
      ? {
          image: `${SITE_URL}${exaltado.foto}`,
          imageWidth: dimensionesFoto.width,
          imageHeight: dimensionesFoto.height,
          imageAlt: `Foto de ${nombreCompleto}`,
        }
      : {};

  return generateSEOMetadata({
    title: `${nombreCompleto} - Exaltado PFDH`,
    description: descripcionExaltado(exaltado),
    keywords: [
      nombreExaltado(exaltado),
      ...(exaltado.apodo ? [exaltado.apodo] : []),
      ...exaltado.deportes,
      "exaltado",
      `exaltación ${exaltado.anoExaltacion}`,
    ],
    url: `/directorio/${exaltado.id}`,
    type: esEquipo ? "article" : "profile",
    ...fotoSocial,
  });
}

/** JSON-LD del perfil (Person o SportsTeam) y su ruta de navegación. */
export function jsonLdExaltado(
  exaltado: ExaltadoSeo,
  dimensionesFoto?: DimensionesImagen,
): Record<string, unknown>[] {
  const url = `${SITE_URL}/directorio/${exaltado.id}`;
  const esEquipo = exaltado.categoria === "EQUIPO";

  const perfil: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": esEquipo ? "SportsTeam" : "Person",
    "@id": url,
    url,
    name: nombreExaltado(exaltado),
    ...(exaltado.apodo ? { alternateName: exaltado.apodo } : {}),
    description: descripcionExaltado(exaltado),
    ...(exaltado.foto
      ? {
          image: dimensionesFoto
            ? {
                "@type": "ImageObject",
                url: `${SITE_URL}${exaltado.foto}`,
                width: dimensionesFoto.width,
                height: dimensionesFoto.height,
              }
            : `${SITE_URL}${exaltado.foto}`,
        }
      : {}),
    award: `Exaltación al ${NOMBRE_ORGANIZACION} (${exaltado.anoExaltacion})`,
    ...(esEquipo ? { sport: exaltado.deportes } : {}),
    ...(!esEquipo && exaltado.fechaFallecimiento
      ? { deathDate: exaltado.fechaFallecimiento }
      : {}),
    mainEntityOfPage: url,
  };

  const ruta = generateBreadcrumbs([
    { name: "Inicio", url: SITE_URL },
    { name: "Directorio de Exaltados", url: `${SITE_URL}/directorio` },
    { name: nombreExaltado(exaltado), url },
  ]);

  return [perfil, ruta];
}
