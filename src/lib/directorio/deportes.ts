/**
 * Páginas por deporte (`/directorio/deporte/<slug>`).
 *
 * Una página por deporte individual. Un exaltado con varios deportes sale en
 * la página de cada uno. El slug no lleva acentos ni mayúsculas
 * («Béisbol» → `beisbol`, «Lucha Olímpica» → `lucha-olimpica`), y es el mismo
 * que publica `sitemap.xml`.
 */
import { exaltados } from "@/data/exaltados";

/** Slug de un deporte: minúsculas, sin acentos, espacios como guiones. */
export function slugDeporte(nombre: string): string {
  return nombre
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, "-");
}

/** Deportes con al menos un exaltado: nombre tal como está en los datos y su slug. */
export function deportesDelDirectorio(): { nombre: string; slug: string }[] {
  const porSlug = new Map<string, string>();
  for (const exaltado of exaltados) {
    for (const deporte of exaltado.deporte) {
      const slug = slugDeporte(deporte);
      if (!porSlug.has(slug)) porSlug.set(slug, deporte);
    }
  }
  return [...porSlug].map(([slug, nombre]) => ({ nombre, slug }));
}

/**
 * Deporte y exaltados de una página. `segmento` es el tramo de la URL tal
 * como llega (puede venir codificado o con acentos: `b%C3%A9isbol` vale igual
 * que `beisbol`). `undefined` si ningún exaltado practica ese deporte.
 */
export function deporteDeSegmento(segmento: string) {
  let decodificado = segmento;
  try {
    decodificado = decodeURIComponent(segmento);
  } catch {
    // Segmento mal codificado: se compara tal cual.
  }
  const slug = slugDeporte(decodificado);
  const deporte = deportesDelDirectorio().find((d) => d.slug === slug);
  if (!deporte) return undefined;

  return {
    ...deporte,
    exaltados: exaltados.filter((e) =>
      e.deporte.some((d) => slugDeporte(d) === slug),
    ),
  };
}
